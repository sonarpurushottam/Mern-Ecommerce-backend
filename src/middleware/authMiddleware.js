import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Middleware to protect routes requiring authentication
const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header contains a Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the Authorization header
      token = req.headers.authorization.split(" ")[1];
      // console.log("Received Token:", token); // Log the token received in the request

      // Verify the token using the JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Decoded Token:", decoded);

      // Find the user associated with the token and exclude the password field
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        // Return 401 if the user is not found
        return res.status(401).json({ message: "User not found" });
      }

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Log and return an error if token verification fails
      console.error("Token verification failed:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // Return 401 if no token is provided
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to restrict access to admin users
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    // Proceed if the user is an admin
    next();
  } else {
    // Return 401 if the user is not an admin
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};

// Middleware to restrict access to superadmin users
const superAdmin = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    // Proceed if the user is a superadmin
    next();
  } else {
    // Return 401 if the user is not a superadmin
    res.status(401).json({ message: "Not authorized as a superadmin" });
  }
};

export { protect, admin, superAdmin };
