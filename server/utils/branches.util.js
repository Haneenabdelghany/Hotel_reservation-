import Branch from "../models/Branches.js";
import mongoose from "mongoose";
export const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.aggregate([
      { $unwind: "$rooms" },
      {
        $lookup: {
          from: "rooms",
          localField: "rooms.roomId",
          foreignField: "_id",
          as: "roomInfo"
        }
      },
      {
        $addFields: {
          "rooms.roomDetails": {
            type: { $arrayElemAt: ["$roomInfo.type", 0] },
            price_per_night: { $arrayElemAt: ["$roomInfo.price_per_night", 0] },
            meals: { $arrayElemAt: ["$roomInfo.meals", 0] }
          }
        }
      },
      { 
        $project: { 
          roomInfo: 0,
          "rooms._id": 0 
        }
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          country: { $first: "$country" },
          rooms: { $push: "$rooms" },
          __v: { $first: "$__v" }
        }
      }
    ]);
    res.status(200).json({ message: "Branches found", data: branches });
    if(!branches || branches.length==0)
    {
    res.status(404).json({ message: "Branches are not found", data: null });

    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch branches", data: null });
  }
};

export const getBranchByID = async (req, res) => {
  const id = req.params.id;
  try {
    const branch = await Branch.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $unwind: "$rooms" },
      {
        $lookup: {
          from: "rooms",
          localField: "rooms.roomId",
          foreignField: "_id",
          as: "roomInfo"
        }
      },
      {
        $addFields: {
          "rooms.roomDetails": {
            type: { $arrayElemAt: ["$roomInfo.type", 0] },
            price_per_night: { $arrayElemAt: ["$roomInfo.price_per_night", 0] },
            meals: { $arrayElemAt: ["$roomInfo.meals", 0] }
          }
        }
      },
      { 
        $project: { 
          roomInfo: 0,
          "rooms._id": 0 
        }
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          country: { $first: "$country" },
          rooms: { $push: "$rooms" },
          __v: { $first: "$__v" }
        }
      }
    ]);
    if (!branch || !branch.length) {
      res.status(404).json({ message: "Branch not found", data: null });
    }

    res.status(200).json({ message: "Branch found", data: { branch } });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch branches" });
  }
};
