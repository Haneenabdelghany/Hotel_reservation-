import Reservation from "../models/Reservation.js";

export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json({ message: "Reservations found", data: reservations });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reservations", data: null });
  }
};

export const getReservationByID = async (req, res) => {
  const id = req.params.id;

  try {
    const reservation = await Reservation.findById(id)
      .populate("branchID", "name country")
      .populate("roomID", "type price_per_night");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found", data: null });
    }

    res.status(200).json({ message: "Reservation found", data: reservation });
  } catch (error) {
    res.status(500).json({ message: error.message, data: null });
  }
};



export const addReservation = async (req, res) => {
  const userId = req.user.id
  try {
    const data = { ...req.body, guestID: userId }
    const reservation = await Reservation.insertOne(data, { runValidators: true });
    res.status(200).json({ message: "Reservation added", data: reservation });
  } catch (error) {
    res.status(500).json({ message: error.message, data: null });
  }
};

export const modifyReservation = async (req, res) => {
  const { _id, ...data } = req.body;
  try {
    if (!_id) {
      return res.status(400).json("Reservation ID is required");
    }
    const reservation = await Reservation.findByIdAndUpdate(
      _id,
      { $set: data },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ message: "Reservation Updated", data: reservation });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reservations", data: null });
  }
};


export const deleteReservation = async (req, res) => {
  const id = req.params.id;
  try {

    let reservation = await Reservation.findById(id)
    if (!reservation) {
      res.status(404).json({ message: "reservation is not found", data: null })
    }
    reservation = await Reservation.findByIdAndDelete(id)
    res.status(200).json({ message: "Reservation has been deleted successfully", data: reservation })
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getReservationsByUserID = (req, res) => {
  const userId = req.params.id;
  try {
    const reservations = Reservation.find({ guestID: new mongoose.Types.ObjectId(userId) })
    if (!reservations.length) {
      res.status(404).json({ message: "Reservations not found" })
    }
    res.status(200).json({ message: "Reservations found", data: reservations })
  }

  catch (error) {
    res.status(500).json({ message: error.message })
  }
}