import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  image: {
    type: String,
  },
});

export default mongoose.model("Brand", brandSchema);
