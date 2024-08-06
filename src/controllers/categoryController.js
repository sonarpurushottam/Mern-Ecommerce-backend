import Category from "../models/categoryModel.js";
import asyncHandler from "express-async-handler";
import { handleUpload, handleDelete } from "../config/cloudinaryConfig.js";

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const file = req.file; // single file upload

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    let imageUrl = null;
    let imagePublicId = null;

    // Handle image upload if a file is included in the request
    if (file) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI, "categories");
      imageUrl = cldRes.secure_url;
      imagePublicId = cldRes.public_id;
    }

    const categoryData = {
      name,
      image: imageUrl,
      imagePublicId: imagePublicId,
    };

    const category = new Category(categoryData);
    const createdCategory = await category.save();

    res.status(201).json(createdCategory);
  } catch (error) {
    console.error("Error during category creation:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update a category
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.categoryId);

  if (category) {
    const { name } = req.body;
    let imageUrl = category.image; // Keep the existing image URL if no new image is provided

    // Handle image upload if a file is included in the request
    if (req.file) {
      // Delete the old image from Cloudinary if it exists
      if (category.imagePublicId) {
        try {
          await handleDelete(category.imagePublicId);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }

      // Convert the file buffer to a base64 string
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      // Upload the new image
      try {
        const result = await handleUpload(dataURI, "categories");
        imageUrl = result.secure_url;
        category.imagePublicId = result.public_id; // Update the public ID
      } catch (error) {
        console.error("Error uploading new image:", error);
        return res.status(500).json({ message: "Failed to upload image" });
      }
    }

    // Update category details
    category.name = name || category.name;
    category.image = imageUrl; // Update the image URL

    // Save the updated category
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// Delete a category
const removeCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.categoryId);

  if (category) {
    // Delete the image from Cloudinary if it exists
    if (category.image) {
      const publicId = category.image.split("/").pop().split(".")[0]; // Extract public ID from the URL
      await handleDelete(publicId);
    }

    await Category.findByIdAndDelete(req.params.categoryId);
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
