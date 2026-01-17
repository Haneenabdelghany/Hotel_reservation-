import "dotenv/config";
import express from "express";
import cors from "cors";
import { authAdmin, createUser } from "./utils/users.util.js";
import { authUser } from "./utils/users.util.js";
import connectDB from "./utils/db.util.js";
import {
  addReservation,
  deleteReservation,
  getAllReservations,
  getReservationByID,
  getReservationsByUserID,
  modifyReservation,
} from "./utils/reservations.util.js";
import { getAllBranches, getBranchByID } from "./utils/branches.util.js";
import { getRooms } from "./utils/rooms.util.js";
import { verifyToken } from "./utils/auth.util.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

//users
app.post("/user/register", createUser);
app.post("/user/login", authUser);
app.get("/user/validate-token", verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid", data: null });
});

//reservations
app.get("/reservations", verifyToken, authAdmin, getAllReservations);
app.get("/reservations/:id", verifyToken, getReservationByID);
app.get("/reservations/user/:id", verifyToken, getReservationsByUserID)
app.post("/reservations", verifyToken, addReservation);
app.put("/reservations", verifyToken, authAdmin, modifyReservation);
app.delete("/reservations/:id", verifyToken, authAdmin, deleteReservation);

//Branches
app.get("/branches", getAllBranches);
app.get("/branches/:id", getBranchByID);

//rooms
app.get("/rooms/:limit", getRooms);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
