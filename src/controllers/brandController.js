import Brand from "../models/brandModel.js";
import asyncHandler from "express-async-handler";
import { handleUpload, handleDelete } from "../config/cloudinaryConfig.js";

// Create a new brand
const createBrand = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const file = req.file; // single file upload

  if (!name) {
    return res.status(400).json({ message: "Brand name is required" });
  }

  try {
    let imageUrl = null;
    let imagePublicId = null;

    // Handle image upload if a file is included in the request
    if (file) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI, "brands");
      imageUrl = cldRes.secure_url;
      imagePublicId = cldRes.public_id;
    }

    const brandData = {
      name,
      category,
      image: imageUrl,
      imagePublicId: imagePublicId,
    };

    const brand = new Brand(brandData);
    const createdBrand = await brand.save();

    res.status(201).json(createdBrand);
  } catch (error) {
    console.error("Error during brand creation:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update a brand
const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.brandId);

  if (brand) {
    const { name } = req.body;
    let imageUrl = brand.image; // Keep the existing image URL if no new image is provided

    // Handle image upload if a file is included in the request
    if (req.file) {
      // Delete the old image from Cloudinary if it exists
      if (brand.imagePublicId) {
        try {
          await handleDelete(brand.imagePublicId);
        } catch (error) {
          console.error("Error deleting old image:", error);
          return res
            .status(500)
            .json({ message: "Failed to delete old image" });
        }
      }

      // Convert the file buffer to a base64 string
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      // Upload the new image
      try {
        const result = await handleUpload(dataURI, "brands");
        imageUrl = result.secure_url;
        brand.imagePublicId = result.public_id; // Update the public ID
      } catch (error) {
        console.error("Error uploading new image:", error);
        return res.status(500).json({ message: "Failed to upload image" });
      }
    }

    // Update brand details
    brand.name = name || brand.name;
    brand.image = imageUrl; // Update the image URL

    // Save the updated brand
    const updatedBrand = await brand.save();
    res.json(updatedBrand);
  } else {
    res.status(404);
    throw new Error("Brand not found");
  }
});

// Delete a brand
const removeBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.brandId);

  if (brand) {
    // Delete the image from Cloudinary if it exists
    if (brand.image) {
      const publicId = brand.image.split("/").pop().split(".")[0]; // Extract public ID from the URL
      await handleDelete(publicId);
    }

    await Brand.findByIdAndDelete(req.params.brandId);
    res.json({ message: "Brand removed" });
  } else {
    res.status(404);
    throw new Error("Brand not found");
  }
});

// List all brands
const listBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).populate("category");
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List brands by category
const listBrandsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const brands = await Brand.find({ category: categoryId });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read a single brand
const readBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (brand) {
    res.json(brand);
  } else {
    res.status(404);
    throw new Error("Brand not found");
  }
});
export const getBrandsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  
  try {
    const brands = await Brand.find({ category: categoryId });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  createBrand,
  updateBrand,
  removeBrand,
  listBrands,
  listBrandsByCategory,
  readBrand,
};
