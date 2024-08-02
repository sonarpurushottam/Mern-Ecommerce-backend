// backend/controllers/paymentController.js
import Payment from '../models/paymentModel.js';

export const processPayment = async (req, res) => {
  const { amount, paymentMethod } = req.body;

  try {
    const payment = new Payment({
      userId: req.user.id,
      amount,
      paymentMethod
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
