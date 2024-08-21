import Order from "../models/OrderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Address from "../models/AddressModel.js";

// export const getOrders = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { status, sort } = req.query;

//     let query = {};

//     if (req.user.role !== "admin") {
//       query.userId = userId; // Only filter by userId for non-admin users
//     }

//     if (status) {
//       query.status = status;
//     }

//     let orders = Order.find(query).populate("userId", "username").populate({
//       path: "items.productId",
//       select: "name price productImage",
//       model: Product,
//     });

//     if (sort) {
//       orders = orders.sort({ createdAt: sort === "desc" ? -1 : 1 });
//     }

//     orders = await orders.exec();

//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching orders" });
//   }
// };

// export const getOrderById = async (req, res) => {
//   try {
//     const userId = req.user._id; // Get the authenticated user's ID
//     const order = await Order.findOne({ _id: req.params.id, userId }) // Ensure the order belongs to the user
//       .populate("userId", "username")
//       .populate({
//         path: "items.productId",
//         select: "name price productImage", // Populate product details
//         model: Product,
//       });

//     if (!order) return res.status(404).json({ message: "Order not found" });

//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Create a new order
// export const createOrder = async (req, res) => {
//   try {
//     const { userId, items, totalAmount } = req.body;

//     if (!userId || !items || items.length === 0 || totalAmount === undefined) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Validate each item in the order
//     for (const item of items) {
//       if (!item.productId || !item.price || !item.quantity) {
//         return res.status(400).json({ message: "Invalid item data" });
//       }
//       if (item.quantity <= 0 || item.price <= 0) {
//         return res.status(400).json({ message: "Invalid quantity or price" });
//       }
//     }

//     const newOrder = new Order({ userId, items, totalAmount });
//     const savedOrder = await newOrder.save();

//     res.status(201).json(savedOrder);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, sort } = req.query;

    let query = {};

    if (req.user.role !== "admin") {
      query.userId = userId; // Only filter by userId for non-admin users
    }

    if (status) {
      query.status = status;
    }

    let orders = Order.find(query)
      .populate("userId", "username")
      .populate({
        path: "items.productId",
        select: "name price productImage",
        model: Product,
      })
      .populate({
        path: "shippingAddress",
        select: "street city state postalCode country",
        model: Address,
      });

    if (sort) {
      orders = orders.sort({ createdAt: sort === "desc" ? -1 : 1 });
    }

    orders = await orders.exec();

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user._id; // Get the authenticated user's ID
    const order = await Order.findOne({ _id: req.params.id, userId })
      .populate("userId", "username")
      .populate({
        path: "items.productId",
        select: "name price productImage",
        model: Product,
      })
      .populate({
        path: "shippingAddress",
        select: "street city state postalCode country",
        model: Address,
      });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress } = req.body;

    if (!userId || !items || items.length === 0 || totalAmount === undefined || !shippingAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate each item in the order
    for (const item of items) {
      if (!item.productId || !item.price || !item.quantity) {
        return res.status(400).json({ message: "Invalid item data" });
      }
      if (item.quantity <= 0 || item.price <= 0) {
        return res.status(400).json({ message: "Invalid quantity or price" });
      }
    }

    const newOrder = new Order({ userId, items, totalAmount, shippingAddress });
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status; // Update the order status
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Allow deletion if the order is in "Pending", "Processing", or "Cancelled" state
    if (["Pending", "Processing", "Cancelled"].includes(order.status)) {
      await Order.findByIdAndDelete(req.params.id); // Use findByIdAndDelete
      return res.json({ message: "Order deleted successfully" });
    }

    res.status(400).json({ message: "Order cannot be deleted" });
  } catch (error) {
    console.error("Error deleting order:", error); // Log the error details
    res.status(500).json({ message: error.message });
  }
};
