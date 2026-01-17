import mongoose from "mongoose";

const brancheSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  rooms: [
    {
      roomId: { type: mongoose.Types.ObjectId, required: true, ref: "Room" },
      reservedCount: { type: Number, required: true, default: 0 },
      totalCount: { type: Number, required: true },
    },
  ],
});

export default mongoose.model("Branch", brancheSchema);
