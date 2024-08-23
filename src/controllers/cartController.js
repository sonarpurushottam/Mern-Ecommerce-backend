import Cart from "../models/CartModel.js";

// Get the user's cart
export const getCart = async (req, res) => {
  try {
    // Find the cart for the current user and populate product details
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    res.json(cart); // Respond with the cart details
  } catch (error) {
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};

// Add a product to the user's cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (cart) {
      // If the cart exists, find the item and update its quantity or add a new item
      const itemIndex = cart.items.findIndex((item) => item.productId == productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    } else {
      // If the cart does not exist, create a new one
      cart = new Cart({
        userId: req.user.id,
        items: [{ productId, quantity }],
      });
    }

    await cart.save();
    res.status(201).json(cart); // Respond with the updated cart
  } catch (error) {
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};

// Update items in the user's cart
export const updateCartItem = async (req, res) => {
  const { items } = req.body; // Expecting an array of items for multiple updates

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: "Invalid items array" }); // Validate input
  }

  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" }); // Respond if the cart does not exist
    }

    items.forEach((item) => {
      const itemIndex = cart.items.findIndex((i) => i._id == item._id);

      if (itemIndex > -1) {
        if (item.quantity > 0) {
          cart.items[itemIndex].quantity = item.quantity; // Update item quantity
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
    res.json(cart); // Respond with the updated cart
  } catch (error) {
    console.error("Error in updateCartItem:", error);
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};

// Remove an item from the user's cart
export const removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" }); // Respond if the cart does not exist

    // Remove the item from the cart
    cart.items = cart.items.filter((item) => item._id != itemId);

    await cart.save();
    res.json(cart); // Respond with the updated cart
  } catch (error) {
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};

// Get the total number of items in the user's cart
export const getCartItemCount = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" }); // Respond if the cart does not exist
    }
    // Calculate the total number of items
    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    res.json({ itemCount }); // Respond with the item count
  } catch (error) {
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};

// Clear all items from the user's cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" }); // Respond if the cart does not exist
    }

    cart.items = []; // Clear all items in the cart

    await cart.save();
    res.json({ message: "Cart cleared successfully" }); // Respond with a success message
  } catch (error) {
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};
