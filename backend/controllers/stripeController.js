const stripe = require("../config/stripeConfig");
const { sequelize } = require("../models/postgres");
const { Order, Payment, OrderItem, ShippingDetail, Product } = require("../models/postgres");
const OrderMongo = require("../models/mongo/OrderMongo");
const PaymentMongo = require("../models/mongo/PaymentMongo");
const ProductMongo = require("../models/mongo/ProductMongo");

const createCheckoutSession = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "L'utilisateur doit être connecté." });
    }

    const { items, client_reference_id, shipping_details, promoCode } = req.body;

    await sequelize.transaction(async (t) => {
      const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const order = await Order.create(
        {
          user_id: client_reference_id,
          total_amount: totalAmount,
          status: "pending",
        },
        { transaction: t }
      );

      const orderItemsData = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));
      await OrderItem.bulkCreate(orderItemsData, { transaction: t });

      for (const item of items) {
        const product = await Product.findByPk(item.product_id, { transaction: t, lock: t.LOCK.UPDATE });
        if (!product) throw new Error(`Produit ${item.product_id} introuvable`);
        if (product.stock < item.quantity) {
          const err = new Error(`Stock insuffisant pour le produit ${product.name}`);
          err.status = 403;
          throw err;
        }
        product.stock -= item.quantity;
        await product.save({ transaction: t });

        await ProductMongo.findOneAndUpdate(
          { postgresId: item.product_id.toString() },
          { $inc: { stock: -item.quantity } }
        );
      }

      if (shipping_details) {
        await ShippingDetail.create(
          {
            order_id: order.id,
            address: shipping_details.address,
            city: shipping_details.city,
            postal_code: shipping_details.postal_code,
            country: shipping_details.country,
            shipping_method: shipping_details.shipping_method,
          },
          { transaction: t }
        );
      }

      const lineItems = items.map((item) => {
        let desc = item.description ?? "";
        const productData = { name: item.name || "Sans nom" };
        if (desc.trim() !== "") {
          productData.description = desc;
        }
        return {
          price_data: {
            currency: "eur",
            product_data: productData,
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        };
      });

      let discounts = [];
      if (promoCode) {
        const promoResult = await stripe.promotionCodes.list({ code: promoCode });
        if (promoResult.data.length > 0) {
          discounts = [{ promotion_code: promoResult.data[0].id }];
        }
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        discounts,
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
        client_reference_id: order.id,
      });

      order.stripe_checkout_session_id = session.id;
      await order.save({ transaction: t });

      await OrderMongo.create({
        postgresId: order.id.toString(),
        user_id: client_reference_id.toString(),
        total_amount: parseFloat(order.total_amount),
        status: "pending",
        items: items.map((i) => ({
          product_id: i.product_id.toString(),
          quantity: i.quantity,
          price: parseFloat(i.price),
        })),
        stripe_checkout_session_id: session.id,
      });

      res.json({ url: session.url });
    });
  } catch (error) {
    console.error("Erreur lors de la création de la session Checkout", error);
    res.status(error.status || 500).json({ error: error.message });
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("Webhook reçu:", event.type);
  } catch (err) {
    console.error(`Webhook signature invalide: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("Session complétée reçue:", session.id);
      try {
        const order = await Order.findOne({
          where: { stripe_checkout_session_id: session.id },
        });
        if (!order) {
          console.error("Aucun ordre trouvé pour session id:", session.id);
          break;
        }
        console.log("Order trouvé:", order.id);

        order.status = "paid";
        order.payment_intent_id = session.payment_intent;
        await order.save();
        console.log("Order mis à jour en 'paid'");

        const payment = await Payment.create({
          order_id: order.id,
          amount: order.total_amount,
          currency: "EUR",
          payment_method: "card",
          status: "succeeded",
          stripe_payment_intent_id: session.payment_intent,
          stripe_checkout_session_id: session.id,
          receipt_url: session.receipt_url,
        });
        console.log("Payment créé:", payment.id);

        await OrderMongo.findOneAndUpdate(
          { postgresId: order.id.toString() },
          {
            status: "paid",
            payment_intent_id: session.payment_intent,
          }
        );
        console.log("OrderMongo mis à jour en 'paid'");

        await PaymentMongo.create({
          postgresId: payment.id.toString(),
          order_id: order.id.toString(),
          amount: parseFloat(payment.amount),
          payment_method: payment.payment_method,
          status: "completed",
          stripe_payment_intent_id: payment.stripe_payment_intent_id,
          stripe_checkout_session_id: payment.stripe_checkout_session_id,
          receipt_url: payment.receipt_url,
        });
        console.log("PaymentMongo créé");
      } catch (error) {
        console.error("Erreur dans webhook checkout.session.completed:", error);
      }
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object;
      try {
        const order = await Order.findOne({
          where: { stripe_checkout_session_id: session.id },
          include: [OrderItem],
        });
        if (order && order.status === "pending") {
          await sequelize.transaction(async (t) => {
            const items = await OrderItem.findAll({
              where: { order_id: order.id },
              transaction: t,
            });
            for (const item of items) {
              const product = await Product.findByPk(item.product_id, {
                transaction: t,
                lock: t.LOCK.UPDATE,
              });
              if (product) {
                product.stock += item.quantity;
                await product.save({ transaction: t });
              }
              await ProductMongo.findOneAndUpdate(
                { postgresId: item.product_id.toString() },
                { $inc: { stock: item.quantity } }
              );
            }
            order.status = "canceled";
            await order.save({ transaction: t });
            await OrderMongo.findOneAndUpdate({ postgresId: order.id.toString() }, { status: "canceled" });
          });
          console.log("Order annulé suite à expiration");
        }
      } catch (error) {
        console.error("Erreur dans webhook checkout.session.expired:", error);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      try {
        const order = await Order.findOne({
          where: { payment_intent_id: paymentIntent.id },
          include: [OrderItem],
        });
        if (order && order.status === "pending") {
          await sequelize.transaction(async (t) => {
            const items = await OrderItem.findAll({
              where: { order_id: order.id },
              transaction: t,
            });
            for (const item of items) {
              const product = await Product.findByPk(item.product_id, {
                transaction: t,
                lock: t.LOCK.UPDATE,
              });
              if (product) {
                product.stock += item.quantity;
                await product.save({ transaction: t });
              }
              await ProductMongo.findOneAndUpdate(
                { postgresId: item.product_id.toString() },
                { $inc: { stock: item.quantity } }
              );
            }
            order.status = "canceled";
            await order.save({ transaction: t });
            await OrderMongo.findOneAndUpdate({ postgresId: order.id.toString() }, { status: "canceled" });
          });
          console.log("Order annulé suite à échec du paiement");
        }
      } catch (error) {
        console.error("Erreur dans webhook payment_intent.payment_failed:", error);
      }
      break;
    }

    default:
      console.log(`Événement non géré: ${event.type}`);
      break;
  }

  res.json({ received: true });
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
};
