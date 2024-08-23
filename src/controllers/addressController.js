import Address from "../models/AddressModel.js";

// Create a new address
const createAddress = async (req, res) => {
  // Extract address details from the request body
  const { street, city, state, postalCode, country, isDefault } = req.body;

  try {
    // Create a new address document
    const address = new Address({
      user: req.user._id, // Associate the address with the current user
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
    });

    // If the new address is set as default, update other addresses to not be default
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    // Save the new address to the database
    const createdAddress = await address.save();
    res.status(201).json(createdAddress); // Respond with the created address
  } catch (error) {
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};

// Get all addresses for a user
const getUserAddresses = async (req, res) => {
  try {
    // Find all addresses for the current user
    const addresses = await Address.find({ user: req.user._id });
    res.json(addresses); // Respond with the list of addresses
  } catch (error) {
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};

// Get a single address by ID
const getAddressById = async (req, res) => {
  try {
    // Find the address by its ID
    const address = await Address.findById(req.params.id);

    // Check if the address belongs to the current user
    if (address && address.user.equals(req.user._id)) {
      res.json(address); // Respond with the address details
    } else {
      res.status(404).json({ message: "Address not found" }); // Respond with an error if the address is not found or doesn't belong to the user
    }
  } catch (error) {
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};

// Update an address
const updateAddress = async (req, res) => {
  // Extract updated address details from the request body
  const { street, city, state, postalCode, country, isDefault } = req.body;

  try {
    // Find the address by its ID
    const address = await Address.findById(req.params.id);

    // Check if the address belongs to the current user
    if (address && address.user.equals(req.user._id)) {
      // Update address fields only if new values are provided
      address.street = street || address.street;
      address.city = city || address.city;
      address.state = state || address.state;
      address.postalCode = postalCode || address.postalCode;
      address.country = country || address.country;
      address.isDefault = isDefault;

      // If the address is set as default, update other addresses to not be default
      if (isDefault) {
        await Address.updateMany({ user: req.user._id }, { isDefault: false });
      }

      // Save the updated address to the database
      const updatedAddress = await address.save();
      res.json(updatedAddress); // Respond with the updated address
    } else {
      res.status(404).json({ message: "Address not found" }); // Respond with an error if the address is not found or doesn't belong to the user
    }
  } catch (error) {
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  try {
    // Find and remove the address by its ID
    const address = await Address.findByIdAndDelete(req.params.id);

    // Check if the address belongs to the current user
    if (address && address.user.equals(req.user._id)) {
      res.json({ message: "Address removed" }); // Respond with a success message
    } else {
      res.status(404).json({ message: "Address not found or unauthorized" }); // Respond with an error if the address is not found or doesn't belong to the user
    }
  } catch (error) {
    console.error("Error deleting address:", error); // Log the error for debugging
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};

export {
  createAddress,
  getUserAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
