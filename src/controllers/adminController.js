// backend/controllers/adminController.js
import User from '../models/userModel.js';
import Order from '../models/OrderModel.js';
import Product from '../models/productModel.js';

// Get a list of all users
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    res.json(users); // Send the list of users as a response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};

// Get a list of all orders
export const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find();
    res.json(orders); // Send the list of orders as a response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};

// Get a list of all products
export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();
    res.json(products); // Send the list of products as a response
  } catch (error) {
    res.status(500).json({ message: error.message }); // Respond with an error message if something goes wrong
  }
};
