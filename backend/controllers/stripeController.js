// controller/stripeController.js
const stripe = require("../config/stripeConfig");
const { Order, Payment, OrderItem, ShippingDetail } = require("../models/postgres");
const OrderMongo = require("../models/mongo/OrderMongo");
const PaymentMongo = require("../models/mongo/PaymentMongo");

const createCheckoutSession = async (req, res) => {
  const { items, client_reference_id, shipping_details } = req.body;

  try {
    // Vérifier la présence de req.user.id
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "L'utilisateur doit être connecté." });
    }
    const { items, client_reference_id, shipping_details } = req.body;

    // client_reference_id devrait être un entier (ex: 1)

    const order = await Order.create({
      user_id: client_reference_id, // integer attendu
      total_amount: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      status: "pending",
    });

    // Créer les éléments de commande
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItems);

    // Créer les détails de livraison
    await ShippingDetail.create({
      order_id: order.id,
      address: shipping_details.address,
      city: shipping_details.city,
      postal_code: shipping_details.postal_code,
      country: shipping_details.country,
      shipping_method: shipping_details.shipping_method,
    });

    // Créer une session de checkout Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            description: item.description, // Optionnel
          },
          unit_amount: Math.round(item.price * 100), // en centimes
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      client_reference_id: order.id, // Lier la session à la commande
    });

    // Mettre à jour la commande PostgreSQL avec l'ID de la session
    order.stripe_checkout_session_id = session.id;
    await order.save();

    // Créer une entrée dans MongoDB pour la commande
    await OrderMongo.create({
      postgresId: order.id.toString(),
      user_id: client_reference_id.toString(),
      total_amount: parseFloat(order.total_amount),
      status: "pending",
      items: items.map((item) => ({
        product_id: item.product_id.toString(),
        quantity: item.quantity,
        price: parseFloat(item.price),
      })),
      stripe_checkout_session_id: session.id,
    });

    // Répondre avec l'URL de redirection
    res.json({ url: session.url });
  } catch (error) {
    console.error("Erreur lors de la création de la session Checkout", error);
    res.status(500).json({ error: error.message });
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature invalide: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer l'événement
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      try {
        // Trouver la commande PostgreSQL via l'ID de la session
        const order = await Order.findOne({ where: { stripe_checkout_session_id: session.id } });

        if (order) {
          // Mettre à jour la commande PostgreSQL
          order.status = "paid";
          order.payment_intent_id = session.payment_intent;
          await order.save();

          // Créer ou mettre à jour le paiement PostgreSQL
          const payment = await Payment.create({
            order_id: order.id,
            amount: order.total_amount,
            currency: "EUR", // Ajustez si nécessaire
            payment_method: "card", // Ajustez en fonction des méthodes de paiement utilisées
            status: "succeeded",
            stripe_payment_intent_id: session.payment_intent,
            stripe_checkout_session_id: session.id,
            receipt_url: session.receipt_url,
          });

          // Mettre à jour la commande MongoDB
          await OrderMongo.findOneAndUpdate(
            { postgresId: order.id.toString() },
            {
              status: "paid",
              payment_intent_id: session.payment_intent,
            }
          );

          // Créer ou mettre à jour le paiement MongoDB
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
        }
      } catch (error) {
        console.error("Erreur lors de la gestion du webhook checkout.session.completed", error);
      }

      break;

    case "payment_intent.succeeded":
      // Gestion supplémentaire si nécessaire
      break;

    case "payment_intent.payment_failed":
      // Gérer l'échec de paiement, notifier l'utilisateur, etc.
      break;

    // *(Optionnel)* Gérer d'autres événements comme 'charge.succeeded', 'charge.failed'

    default:
      console.log(`Événement non géré type: ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
};
