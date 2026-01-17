import {
  getAllReservations,
  deleteReservationById,
} from "../../../utils/reservations.util";
import { Modal } from "bootstrap";
import { handleRouteAccess } from "../../../utils/routeHandler.util";
import Loading from "../../../components/Loading";

const loading = new Loading();
document.body.prepend(loading.getHtml());

const container = document.getElementById("dashboard-container");

handleRouteAccess().then((accessGranted) => {
  console.log(accessGranted);
  if (accessGranted) {
    loading.hide();
    container.style.display = "block";
    init();
  }
});

// DOM references
const tableBody = document.getElementById("reservationTableBody");
const deleteModalElement = document.getElementById("deleteModal");
const deleteModal = new Modal(deleteModalElement);
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

let selectedDeleteId = null;

// Initialize dashboard
async function init() {
  const response = await getAllReservations();
  const reservations = response.data;
  renderReservations(reservations);
}

// Render table rows
function renderReservations(reservations) {
  tableBody.innerHTML = "";

  reservations.forEach((reservation) => {
    const tr = document.createElement("tr");

    // Guest Name (linked to details page)
    const guestCell = document.createElement("td");
    const guestLink = document.createElement("a");
    guestLink.href = `/reservation/details?id=${reservation._id}`;
    guestLink.textContent = reservation.guestName;
    guestLink.className = "text-decoration-none";
    guestCell.appendChild(guestLink);

    // Phone Number
    const phoneCell = document.createElement("td");
    phoneCell.textContent = reservation.phoneNumber;

    // Check-in Date
    const checkinCell = document.createElement("td");
    checkinCell.textContent = new Date(
      reservation.checkinDate
    ).toLocaleDateString();

    // Check-out Date
    const checkoutCell = document.createElement("td");
    checkoutCell.textContent = new Date(
      reservation.checkoutDate
    ).toLocaleDateString();

    // Number of Rooms
    const roomsCell = document.createElement("td");
    roomsCell.textContent = reservation.numOfRooms;

    // Actions (Edit, Delete)
    const actionsCell = document.createElement("td");

    const editBtn = document.createElement("a");
    editBtn.href = `/reservation/edit?id=${reservation._id}`;
    editBtn.className = "btn btn-sm btn-primary me-2";
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      selectedDeleteId = reservation._id;
      deleteModal.show();
    });

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);

    // Append cells to row
    tr.appendChild(guestCell);
    tr.appendChild(phoneCell);
    tr.appendChild(checkinCell);
    tr.appendChild(checkoutCell);
    tr.appendChild(roomsCell);
    tr.appendChild(actionsCell);

    tableBody.appendChild(tr);
  });
}

// Delete reservation action
confirmDeleteBtn.addEventListener("click", async () => {
  if (selectedDeleteId) {
    const resposne = await deleteReservationById(selectedDeleteId);
    deleteModal.hide();
    init();
  }
});
