import Address from "../models/addressModel.js";

// Create a new address
const createAddress = async (req, res) => {
  const { street, city, state, postalCode, country, isDefault } = req.body;

  try {
    const address = new Address({
      user: req.user._id,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
    });

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const createdAddress = await address.save();
    res.status(201).json(createdAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all addresses for a user
const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single address by ID
const getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (address && address.user.equals(req.user._id)) {
      res.json(address);
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an address
const updateAddress = async (req, res) => {
  const { street, city, state, postalCode, country, isDefault } = req.body;

  try {
    const address = await Address.findById(req.params.id);

    if (address && address.user.equals(req.user._id)) {
      address.street = street || address.street;
      address.city = city || address.city;
      address.state = state || address.state;
      address.postalCode = postalCode || address.postalCode;
      address.country = country || address.country;
      address.isDefault = isDefault;

      if (isDefault) {
        await Address.updateMany({ user: req.user._id }, { isDefault: false });
      }

      const updatedAddress = await address.save();
      res.json(updatedAddress);
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (address && address.user.equals(req.user._id)) {
      await address.remove();
      res.json({ message: "Address removed" });
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
import fs from "fs";
import path from "path";

console.log(
  "Checking if file exists:",
  fs.existsSync(path.resolve("src/models/addressModel.js"))
);
