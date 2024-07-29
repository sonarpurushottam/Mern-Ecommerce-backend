import Brand from "../models/brandModel.js";
import asyncHandler from "express-async-handler";

// Create a new brand
const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = new Brand({ name });
  const createdBrand = await brand.save();
  res.status(201).json(createdBrand);
});

// Update a brand
const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.brandId);
  if (brand) {
    brand.name = req.body.name || brand.name;
    const updatedBrand = await brand.save();
    res.json(updatedBrand);
  } else {
    res.status(404);
    throw new Error("Brand not found");
  }
});

// Delete a brand
const removeBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.brandId);
  if (brand) {
    res.json({ message: "Brand removed" });
  } else {
    res.status(404);
    throw new Error("Brand not found");
  }
});

// List all brands
const listBrand = asyncHandler(async (req, res) => {
  const brands = await Brand.find({});
  res.json(brands);
});

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

export { createBrand, updateBrand, removeBrand, listBrand, readBrand };
