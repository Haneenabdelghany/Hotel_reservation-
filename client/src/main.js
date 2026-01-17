import "./styles/main.css";
import { getRooms } from "./utils/rooms.util";

const rooms = await getRooms(6);
const container = document.getElementById("rooms-container");

rooms.data.forEach((room, index) => {
  const row = document.createElement("div");
  row.className = "row align-items-center mb-5";

  const imgCol = document.createElement("div");
  const detailsCol = document.createElement("div");

  // Common classes for both
  imgCol.className = "col-md-6 mb-3 mb-md-0";
  detailsCol.className = "col-md-6";

  // Image content
  imgCol.innerHTML = `
    <img src="${room.imgURL}" alt="${room.type}" class="img-fluid rounded shadow" style="height:300px; object-fit:cover;">
  `;

  // Details content
  detailsCol.innerHTML = `
    <h2>${room.type} Room</h2>
    <p>${room.description}</p>
    <p><strong>Price per Night:</strong> $${room.price_per_night}</p>
    <p>
      <strong>Meals:</strong> 
      Breakfast: ${room.meals.breakfast ? "✅" : "❌"} | 
      Lunch: ${room.meals.lunch ? "✅" : "❌"} | 
      Dinner: ${room.meals.dinner ? "✅" : "❌"}
    </p>
  `;

  // Layout order:
  if (index % 2 === 0) {
    imgCol.classList.add("order-1", "order-md-1");
    detailsCol.classList.add("order-2", "order-md-2");
  } else {
    imgCol.classList.add("order-1", "order-md-2");
    detailsCol.classList.add("order-2", "order-md-1");
  }

  row.appendChild(imgCol);
  row.appendChild(detailsCol);
  container.appendChild(row);
});
