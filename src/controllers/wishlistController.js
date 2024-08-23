import Wishlist from "../models/WishlistModel.js";

// Get the wishlist for the authenticated user
export const getWishlist = async (req, res) => {
  try {
    // Find the wishlist by user ID and populate product details
    const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    res.json(wishlist);
  } catch (error) {
    // Handle any errors during the operation
    res.status(500).json({ message: error.message });
  }
};

// Add a product to the user's wishlist
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    // Find the user's wishlist
    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (wishlist) {
      // Check if the product already exists in the wishlist
      const itemExists = wishlist.items.some(
        (item) => item.productId == productId
      );

      // Add the product if it does not exist
      if (!itemExists) {
        wishlist.items.push({ productId });
      }
    } else {
      // Create a new wishlist if one does not exist
      wishlist = new Wishlist({
        userId: req.user.id,
        items: [{ productId }],
      });
    }

    // Save the updated or new wishlist
    await wishlist.save();
    res.status(201).json(wishlist);
  } catch (error) {
    // Handle any errors during the operation
    res.status(500).json({ message: error.message });
  }
};

// Remove a product from the user's wishlist
export const removeFromWishlist = async (req, res) => {
  const { itemId } = req.params;

  try {
    // Find the user's wishlist
    const wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      // Return 404 if the wishlist is not found
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Remove the item with the given ID from the wishlist
    wishlist.items = wishlist.items.filter((item) => item._id != itemId);

    // Save the updated wishlist
    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    // Handle any errors during the operation
    res.status(500).json({ message: error.message });
  }
};

// Get the count of items in the user's wishlist
export const getWishlistCount = async (req, res) => {
  try {
    // Find the user's wishlist
    const wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (wishlist) {
      // Return the count of items in the wishlist
      const count = wishlist.items.length;
      res.json({ count });
    } else {
      // Return 0 if the wishlist is not found
      res.json({ count: 0 });
    }
  } catch (error) {
    // Handle any errors during the operation
    res.status(500).json({ message: error.message });
  }
};
