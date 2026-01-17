import { getReservationById } from "../../../utils/reservations.util.js";
import { handleRouteAccess } from "../../../utils/routeHandler.util.js";
import Loading from "../../../components/Loading";

const loading = new Loading();
console.log(loading.getHtml());
document.body.prepend(loading.getHtml());

const container = document.getElementById('reservation-details-container');

handleRouteAccess().then((accessGranted) => {
    console.log(accessGranted);
    if (accessGranted) {
        loading.hide();
        container.style.display = 'block';
        init();
    }
});

const urlParams = new URLSearchParams(window.location.search);
const reservationId = urlParams.get("id");

const detailsContainer = document.getElementById("reservationDetails");
const editButton = document.getElementById("editButton");

async function init() {
    if (!reservationId) {
        detailsContainer.innerHTML = "<p class='text-danger'>No reservation ID provided.</p>";
        editButton.style.display = "none";
        return;
    }

    const reservationResponse = await getReservationById(reservationId);
    const reservation = reservationResponse.data;

    if (!reservation) {
        detailsContainer.innerHTML = "<p class='text-danger'>Reservation not found.</p>";
        editButton.style.display = "none";
        return;
    }

    renderReservationDetails(reservation);
}

function renderReservationDetails(reservation) {
    const { guestName, phoneNumber, checkinDate, checkoutDate, numOfRooms, branchID, roomID, guestID, meals, _id } = reservation;

    detailsContainer.innerHTML = `
    <ul class="list-group">
      <li class="list-group-item"><strong>Guest Name:</strong> ${guestName}</li>
      <li class="list-group-item"><strong>Phone Number:</strong> ${phoneNumber}</li>
      <li class="list-group-item"><strong>Check-in Date:</strong> ${new Date(checkinDate).toLocaleDateString()}</li>
      <li class="list-group-item"><strong>Check-out Date:</strong> ${new Date(checkoutDate).toLocaleDateString()}</li>
      <li class="list-group-item"><strong>Number of Rooms:</strong> ${numOfRooms}</li>
      <li class="list-group-item"><strong>Branch:</strong> ${branchID.name} (${branchID.country})</li>
      <li class="list-group-item"><strong>Room Type:</strong> ${roomID.type}</li>
      <li class="list-group-item"><strong>Price Per Night:</strong> ${roomID.price_per_night} EGP</li>
      <li class="list-group-item"><strong>Meals:</strong>
        <ul>
          <li>Breakfast: ${meals.breakfast ? "Yes" : "No"}</li>
          <li>Lunch: ${meals.lunch ? "Yes" : "No"}</li>
          <li>Dinner: ${meals.dinner ? "Yes" : "No"}</li>
        </ul>
      </li>
      <li class="list-group-item"><strong>Guest ID:</strong> ${guestID}</li>
      <li class="list-group-item"><strong>Reservation ID:</strong> ${_id}</li>
    </ul>
  `;

    editButton.href = `/reservation/edit?id=${_id}`;
}

init();
