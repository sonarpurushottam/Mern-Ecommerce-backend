import mongoose from "mongoose";

// Function to connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB with the URI from environment variables
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Successfully connected to MongoDB 👍`);
  } catch (error) {
    // If the connection fails, log the error and exit the process
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
