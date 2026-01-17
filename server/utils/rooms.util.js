import Room from "../models/Rooms.js";

export const getRooms = async (req, res) => {
  const limit = req.params.limit;
  let rooms;
  try {
    if (limit > 0) {
      rooms = await Room.find().limit(limit);
    } else {
      rooms = await Room.find();
    }
    if (!rooms || rooms.length == 0) {
      res.status(404).json({ message: "Rooms not found", data: null });
    }
    res.status(200).json({ message: "Rooms found", data: rooms });
  } catch (error) {
    res.status(500).json({message:error.message, data:null})
  }
};
