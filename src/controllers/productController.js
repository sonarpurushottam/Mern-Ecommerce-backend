import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinaryConfig2.js";

// Service functions
const uploadProduct = async (productData) => {
  const existingProduct = await Product.findOne({ name: productData.name });
  if (existingProduct) {
    throw new Error("Product with the same name already exists");
  }
  const product = new Product(productData);
  return product.save();
};

const getAllProducts = async () => {
  return await Product.find().sort({ createdAt: -1 });
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

// Handlers
export const uploadProductHandler = async (req, res) => {
  const files = req.files.length > 0 ? req.files : [];
  const { name, brand, category, description, price } = req.body;

  if (!name || !brand || !category || !description || !price || files.length === 0) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const productImages = await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path);
        return result.secure_url;
      })
    );

    const productData = {
      name,
      brand,
      category,
      productImage: productImages,
      description,
      price,
    };
    
    const product = await uploadProduct(productData);
    res.json({ message: "Product uploaded successfully!", product, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const updateProductByIdHandler = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path);
          return result.secure_url;
        })
      );

      for (const image of product.productImage) {
        const publicId = image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
    } else {
      newImages = product.productImage;
    }

    const updatedData = {
      ...req.body,
      productImage: newImages,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    res.json({ message: "Product has been updated", product: updatedProduct, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

export const getAllProductsHandler = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByBrand = async (req, res) => {
  const { brandId } = req.params;
  try {
    const products = await Product.find({ brand: brandId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.find({ category: categoryId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};
