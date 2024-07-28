import {
  cloudinary,
  handleUpload,
  handleDelete,
} from "../config/cloudinaryConfig.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res) => {
  const { username, email, password, mobile } = req.body;
  const file = req.file; // single file upload

  if (!username || !email || !password || !mobile) {
    return res
      .status(400)
      .json({ message: "All fields are required except profile picture" });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    let profilePic = null;
    let profilePicPublicId = null;

    if (file) {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI, "user_profiles");
      profilePic = cldRes.secure_url;
      profilePicPublicId = cldRes.public_id;
    }

    const userData = {
      username,
      email,
      password,
      mobile,
      profilePic,
      profilePicPublicId,
    };

    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        message: "User registered successfully!",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          profilePic: user.profilePic,
          token: generateToken(user._id),
        },
        success: true,
      });
    } else {
      res.status(400).json({ message: "Invalid user data", success: false });
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profilePic: user.profilePic,
        token: generateToken(user._id), // Generate token upon successful login
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profilePic: user.profilePic,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (user) {
//       user.username = req.body.username || user.username;
//       user.email = req.body.email || user.email;
//       user.mobile = req.body.mobile || user.mobile;

//       if (req.body.password) {
//         user.password = req.body.password;
//       }

//       if (req.file) {
//         // Destroy the old profile pic if it exists
//         if (user.profilePicPublicId) {
//           await cloudinary.v2.uploader.destroy(user.profilePicPublicId);
//         }

//         // Convert the file buffer to a base64 string
//         const b64 = Buffer.from(req.file.buffer).toString("base64");
//         const dataURI = `data:${req.file.mimetype};base64,${b64}`;

//         // Upload the new profile pic to Cloudinary
//         const cldRes = await handleUpload(dataURI, "user_profiles");

//         // Update user profile pic details
//         user.profilePic = cldRes.secure_url;
//         user.profilePicPublicId = cldRes.public_id;
//       }

//       // Save the updated user
//       const updatedUser = await user.save();

//       res.json({
//         _id: updatedUser._id,
//         username: updatedUser.username,
//         email: updatedUser.email,
//         mobile: updatedUser.mobile,
//         role: updatedUser.role,
//         profilePic: updatedUser.profilePic,
//         token: generateToken(updatedUser._id), // Generate token upon profile update
//       });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
// Delete user
// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.mobile = req.body.mobile || user.mobile;

      if (req.body.password) {
        user.password = req.body.password;
      }

      if (req.file) {
        // Destroy the old profile pic if it exists
        if (user.profilePicPublicId) {
          try {
            await handleDelete(user.profilePicPublicId);
          } catch (error) {
            console.error("Error deleting old profile picture:", error);
          }
        }

        // Convert the file buffer to a base64 string
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload the new profile pic to Cloudinary
        const cldRes = await handleUpload(dataURI, "user_profiles");

        // Update user profile pic details
        user.profilePic = cldRes.secure_url;
        user.profilePicPublicId = cldRes.public_id;
      }

      // Save the updated user
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
        profilePic: updatedUser.profilePic,
        token: generateToken(updatedUser._id), // Generate token upon profile update
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.profilePicPublicId) {
        await cloudinary.v2.uploader.destroy(user.profilePicPublicId);
      }
      await user.remove();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status({ message: error.message });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUsers,
  getUserById,
};
