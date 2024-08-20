const PaymentPostgres = require('../models/postgres/Payment');
const PaymentMongo = require('../models/mongo/PaymentMongo');
const paymentSchema = require('../schemas/paymentSchema');

// Get all payments (MongoDB)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentMongo.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new payment (PostgreSQL and synchronize with MongoDB)
exports.createPayment = async (req, res) => {
  try {
    const validation = paymentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { order_id, amount, payment_method, status } = validation.data;

    // Crée un nouveau paiement dans PostgreSQL
    const newPaymentPostgres = await PaymentPostgres.create({ order_id, amount, payment_method, status });

    // Synchronisation avec MongoDB
    const newPaymentMongo = new PaymentMongo({
      postgresId: newPaymentPostgres.id,
      order_id,
      amount,
      payment_method,
      status,
    });
    await newPaymentMongo.save();

    res.status(201).json(newPaymentPostgres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a payment (PostgreSQL and MongoDB)
exports.updatePayment = async (req, res) => {
  try {
    const validation = paymentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { order_id, amount, payment_method, status } = validation.data;

    const paymentPostgres = await PaymentPostgres.findByPk(req.params.id);
    if (!paymentPostgres) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Mise à jour du paiement dans PostgreSQL
    paymentPostgres.order_id = order_id;
    paymentPostgres.amount = amount;
    paymentPostgres.payment_method = payment_method;
    paymentPostgres.status = status;
    await paymentPostgres.save();

    // Synchronisation avec MongoDB
    await PaymentMongo.findOneAndUpdate(
      { postgresId: paymentPostgres.id },
      { order_id, amount, payment_method, status }
    );

    res.json(paymentPostgres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a payment (PostgreSQL and MongoDB)
exports.deletePayment = async (req, res) => {
  try {
    const paymentPostgres = await PaymentPostgres.findByPk(req.params.id);
    if (!paymentPostgres) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Suppression du paiement dans PostgreSQL
    await paymentPostgres.destroy();

    // Suppression dans MongoDB
    await PaymentMongo.findOneAndDelete({ postgresId: paymentPostgres.id });

    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
