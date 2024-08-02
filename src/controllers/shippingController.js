// backend/controllers/shippingController.js
import Shipping from '../models/shippingModel.js';

export const getShippingOptions = async (req, res) => {
  try {
    const shippingOptions = await Shipping.find({ userId: req.user.id });
    res.json(shippingOptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addShippingAddress = async (req, res) => {
  const { address, city, state, zipCode, country } = req.body;

  try {
    const shipping = new Shipping({
      userId: req.user.id,
      address,
      city,
      state,
      zipCode,
      country
    });

    await shipping.save();
    res.status(201).json(shipping);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateShippingAddress = async (req, res) => {
  const { address, city, state, zipCode, country } = req.body;

  try {
    const shipping = await Shipping.findById(req.params.id);

    if (!shipping) return res.status(404).json({ message: 'Shipping address not found' });

    shipping.address = address || shipping.address;
    shipping.city = city || shipping.city;
    shipping.state = state || shipping.state;
    shipping.zipCode = zipCode || shipping.zipCode;
    shipping.country = country || shipping.country;

    await shipping.save();
    res.json(shipping);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteShippingAddress = async (req, res) => {
  try {
    const shipping = await Shipping.findById(req.params.id);

    if (!shipping) return res.status(404).json({ message: 'Shipping address not found' });

    await shipping.remove();
    res.json({ message: 'Shipping address deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
