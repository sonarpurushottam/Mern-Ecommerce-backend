// backend/controllers/cartController.js
import Cart from "../models/CartModel.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId == productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    } else {
      cart = new Cart({
        userId: req.user.id,
        items: [{ productId, quantity }],
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  const { items } = req.body; // Expecting items array for multiple updates

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: "Invalid items array" });
  }

  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    items.forEach((item) => {
      const itemIndex = cart.items.findIndex((i) => i._id == item._id);

      if (itemIndex > -1) {
        if (item.quantity > 0) {
          cart.items[itemIndex].quantity = item.quantity;
        } else {
          // Remove the item if quantity is 0 or less
          cart.items.splice(itemIndex, 1);
        }
      } else {
        return res
          .status(404)
          .json({ message: `Item with id ${item._id} not found in cart` });
      }
    });

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Error in updateCartItem:", error);
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item._id != itemId);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Add this function to your cartController.js
export const getCartItemCount = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemCount = cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    res.json({ itemCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = []; // Clear all items in the cart

    await cart.save();
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
