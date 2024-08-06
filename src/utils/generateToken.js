import jwt from "jsonwebtoken";

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  console.log("Generated Token:", token); // Log the generated token for debugging
  return token;
};

export default generateToken;
