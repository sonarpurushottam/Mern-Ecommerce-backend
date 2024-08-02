// backend/controllers/addressController.js
import Address from "../models/AddressModel.js";

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAddress = async (req, res) => {
  const { street, city, state, zipCode, country } = req.body;

  try {
    const address = new Address({
      userId: req.user.id,
      street,
      city,
      state,
      zipCode,
      country,
    });

    await address.save();
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  const { street, city, state, zipCode, country } = req.body;

  try {
    const address = await Address.findById(req.params.id);

    if (!address) return res.status(404).json({ message: "Address not found" });

    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.country = country || address.country;

    await address.save();
    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) return res.status(404).json({ message: "Address not found" });

    await address.remove();
    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
