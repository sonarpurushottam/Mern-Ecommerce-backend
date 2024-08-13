import Order from "../models/OrderModel.js";
import User from '../models/userModel.js';

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'username') // Populate the user data with the name field
      .exec();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// export const getOrdersByUserEmailOrName = async (req, res) => {
//   const { emailOrName } = req.params;
//   try {
//     const orders = await Order.find()
//       .populate({
//         path: 'userId',
//         match: { $or: [{ email: email }, { name: { $regex: username, $options: 'i' } }] },
//         select: 'username'
       
//       })
//       .exec();
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching orders by user email or name' });
//   }
// };
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId")
      .populate("items.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    console.log("Received order data:", { userId, items, totalAmount });

    if (!userId || !items || items.length === 0 || totalAmount === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate each cart item
    for (const item of items) {
      if (!item.productId || !item.price || !item.quantity) {
        return res.status(400).json({ message: "Invalid cart item data" });
      }
      if (item.quantity <= 0 || item.price <= 0) {
        return res.status(400).json({ message: "Invalid quantity or price" });
      }
    }

    const newOrder = new Order({ userId, items, totalAmount });
    const savedOrder = await newOrder.save();

    console.log("Saved order:", savedOrder);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.remove();
    res.json({ message: "Order cancelled" });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ message: error.message });
  }
};

