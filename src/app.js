import express from "express";
import cors from "cors";
import path from "path";

import dotenv from "dotenv";
import connectDB from "./config/db.js";
import indexRoutes from "./routes/indexRouter.js";

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

const PORT = process.env.PORT;

console.log("Current working directory:", process.cwd());
console.log(
  "Resolved path for address model:",
  path.resolve("src/models/addressModel.js")
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
