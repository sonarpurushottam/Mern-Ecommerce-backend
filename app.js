import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import indexRoutes from "./src/routes/indexRouter.js";

dotenv.config();
connectDB();
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(
  cors({
    origin: true, // Allows all origins, can be restricted to specific domains if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api", indexRoutes);

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('Hello, this is your server responding!');
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
