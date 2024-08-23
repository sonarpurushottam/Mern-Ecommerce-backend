import Order from "../models/OrderModel.js";
import Product from "../models/productModel.js";
import Address from "../models/AddressModel.js";

// Fetch orders based on query parameters
export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, sort } = req.query;

    let query = {};

    // Filter by userId if the user is not an admin
    if (req.user.role !== "admin") {
      query.userId = userId;
    }

    if (status) {
      query.status = status; // Filter by order status if provided
    }

    let ordersQuery = Order.find(query)
      .populate("userId", "username") // Populate user details
      .populate({
        path: "items.productId",
        select: "name price productImage",
        model: Product, // Populate product details
      })
      .populate({
        path: "shippingAddress",
        select: "street city state postalCode country",
        model: Address, // Populate shipping address details
      });

    // Sort orders if a sort parameter is provided
    if (sort) {
      ordersQuery = ordersQuery.sort({ createdAt: sort === "desc" ? -1 : 1 });
    }

    const orders = await ordersQuery.exec();

    res.json(orders); // Respond with the list of orders
  } catch (error) {
    console.error("Error fetching orders:", error); // Log error details
    res.status(500).json({ message: "Error fetching orders" }); // Respond with an error message if something goes wrong
  }
};

// Fetch a specific order by its ID
export const getOrderById = async (req, res) => {
  try {
    const userId = req.user._id; // Get the authenticated user's ID
    const order = await Order.findOne({ _id: req.params.id, userId }) // Ensure the order belongs to the user
      .populate("userId", "username")
      .populate({
        path: "items.productId",
        select: "name price productImage",
        model: Product, // Populate product details
      })
      .populate({
        path: "shippingAddress",
        select: "street city state postalCode country",
        model: Address, // Populate shipping address details
      });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order); // Respond with the order details
  } catch (error) {
    console.error("Error fetching order by ID:", error); // Log error details
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress } = req.body;

    if (
      !userId ||
      !items ||
      items.length === 0 ||
      totalAmount === undefined ||
      !shippingAddress
    ) {
      return res.status(400).json({ message: "Missing required fields" }); // Respond if required fields are missing
    }

    // Validate each item in the order
    for (const item of items) {
      if (!item.productId || !item.price || !item.quantity) {
        return res.status(400).json({ message: "Invalid item data" }); // Respond if item data is invalid
      }
      if (item.quantity <= 0 || item.price <= 0) {
        return res.status(400).json({ message: "Invalid quantity or price" }); // Respond if quantity or price is invalid
      }
    }

    const newOrder = new Order({ userId, items, totalAmount, shippingAddress });
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder); // Respond with the created order
  } catch (error) {
    console.error("Error creating order:", error); // Log error details
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};

// Update the status of an order (admin only)
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status; // Update the order status
    await order.save();

    res.json(order); // Respond with the updated order
  } catch (error) {
    console.error("Error updating order status:", error); // Log error details
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};

// Delete an order (only if status is "Pending", "Processing", or "Cancelled")
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" }); // Respond if the order does not exist
    }

    // Allow deletion if the order is in "Pending", "Processing", or "Cancelled" state
    if (["Pending", "Processing", "Cancelled"].includes(order.status)) {
      await Order.findByIdAndDelete(req.params.id); // Delete the order
      return res.json({ message: "Order deleted successfully" });
    }

    res.status(400).json({ message: "Order cannot be deleted" }); // Respond if the order cannot be deleted
  } catch (error) {
    console.error("Error deleting order:", error); // Log error details
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};
