import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    branchID: {
        type: mongoose.Types.ObjectId,
        ref: "Branch",
        required: true,
    },
    roomID: {
        type: mongoose.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    guestID: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    guestName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    checkinDate: { type: Date, required: true },
    checkoutDate: { type: Date, required: true },
    numOfRooms: { type: Number, required: true },
    meals: {
        breakfast: { type: Boolean, default: false },
        lunch: { type: Boolean, default: false },
        dinner: { type: Boolean, default: false },
    },
});

export default mongoose.model("Reservation", reservationSchema);
