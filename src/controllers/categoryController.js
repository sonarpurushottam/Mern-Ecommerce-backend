import Category from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = new Category({ name });
  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// Update a category
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.categoryId);
  if (category) {
    category.name = req.body.name || category.name;
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// Delete a category
const removeCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.categoryId);
  if (category) {
    res.json({ message: "Category removed" });
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// List all categories
const listCategory = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// Read a single category
const readCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};
