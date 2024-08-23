// import jwt from "jsonwebtoken";
// import User from "../models/userModel.js";

// // Middleware to protect routes requiring authentication
// const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select("-password");

//       if (!req.user) {
//         return res.status(401).json({ message: "User not found" });
//       }

//       next();
//     } catch (error) {
//       console.error("Token verification failed:", error.message);
//       res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   } else {
//     res.status(401).json({ message: "Not authorized, no token" });
//   }
// };

// // Middleware to restrict access to admin users
// const admin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     next();
//   } else {
//     res.status(401).json({ message: "Not authorized as an admin" });
//   }
// };

// // Middleware to restrict access to superadmin users
// const superAdmin = (req, res, next) => {
//   if (req.user && req.user.role === "superadmin") {
//     next();
//   } else {
//     res.status(401).json({ message: "Not authorized as a superadmin" });
//   }
// };

// // Middleware to restrict access for demo users
// const demoViewer = (req, res, next) => {
//   // Prevent viewers from modifying orders
//   if (
//     req.user.role === "viewer" &&
//     ["POST", "PUT", "DELETE"].includes(req.method)
//   ) {
//     return res.status(403).json({ message: "Action not allowed for viewers" });
//   }
//   next();
// };
// export { protect, admin, superAdmin, demoViewer };
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Middleware to protect routes requiring authentication
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to restrict access to admin users
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};

// Middleware to restrict access to superadmin users
const superAdmin = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as a superadmin" });
  }
};

// Middleware to restrict actions for viewers
const demoViewer = (req, res, next) => {
  // Prevent viewers from modifying orders
  if (
    req.user.role === "viewer" &&
    ["POST", "PUT", "DELETE"].includes(req.method)
  ) {
    return res.status(403).json({ message: "Action not allowed for viewers" });
  }
  next();
};

export { protect, admin, superAdmin, demoViewer };
