// productController.js
import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinaryConfig2.js";

// Service functions
const uploadProduct = async (productData) => {
  const existingProduct = await Product.findOne({
    name: productData.name,
  });
  if (existingProduct) {
    throw new Error("Product with the same name already exists");
  }
  const product = new Product(productData);
  return product.save();
};

const getAllProducts = async () => {
  const products = await Product.find().sort({ createdAt: -1 });
  return products;
};

const getProductById = async (_id) => {
  return await Product.findById(_id);
};

const updateProductById = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

const deleteProductById = async (id) => {
  return await Product.findByIdAndDelete(id);
};

// Handler functions
export const uploadProductHandler = async (req, res) => {
  const files = req.files.length > 0 ? req.files : [];
  const { name, brand, category, description, price, quantity, countInStock } =
    req.body;

  if (
    !name ||
    !brand ||
    !category ||
    !description ||
    !price ||
    !quantity ||
    !countInStock ||
    files.length === 0
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const productImages = files.map((element) => element.path); // Cloudinary provides 'path' for the URL
    const productData = {
      name,
      brand,
      category,
      productImage: productImages,
      description,
      price,
      quantity,
      countInStock,
    };
    const product = await uploadProduct(productData);
    res.json({
      message: "Product uploaded successfully!",
      product,
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

export const getAllProductsHandler = async (req, res) => {
  try {
    const allProducts = await getAllProducts();
    res.json({
      message: "All Products",
      success: true,
      data: allProducts,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || error,
      success: false,
    });
  }
};

export const getProductByIdHandler = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Specific product", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProductByIdHandler = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Handle new image uploads
    const files = req.files ? req.files : [];
    const newImages = files.map((file) => file.path);

    // Remove old images if new images are provided
    if (newImages.length > 0) {
      product.productImage.forEach(async (image) => {
        const publicId = image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      });
    }

    const updatedData = {
      ...req.body,
      productImage: newImages.length > 0 ? newImages : product.productImage,
    };

    const updatedProduct = await updateProductById(id, updatedData);
    res.json({
      message: "Product has been updated",
      product: updatedProduct,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProductByIdHandler = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await deleteProductById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product has been deleted", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
