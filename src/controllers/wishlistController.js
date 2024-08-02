// backend/controllers/wishlistController.js
import Wishlist from "../models/WishlistModel.js";

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (wishlist) {
      const itemExists = wishlist.items.some(
        (item) => item.productId == productId
      );

      if (!itemExists) {
        wishlist.items.push({ productId });
      }
    } else {
      wishlist = new Wishlist({
        userId: req.user.id,
        items: [{ productId }],
      });
    }

    await wishlist.save();
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { itemId } = req.params;

  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist)
      return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter((item) => item._id != itemId);

    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
