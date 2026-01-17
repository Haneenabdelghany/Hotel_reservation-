import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price_per_night: { type: Number, required: true },
  description: { type: String, required: true },
  imgURL: { type: String, required: true },
  meals: {
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
  },
  
});

export default mongoose.model("Room", roomSchema);
