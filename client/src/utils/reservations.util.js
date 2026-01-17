import { handleResponse } from "./response.util";
import { authService } from "./auth.util";
import { getBEURL } from "./be.util";

const apiBaseUrl = getBEURL();

export async function addReservation(reservation) {
    const response = await fetch(`${apiBaseUrl}/reservations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify(reservation)
    });
    return handleResponse(response);
}

export async function getReservationById(id) {
    const response = await fetch(`${apiBaseUrl}/reservations/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
        }
    });
    return handleResponse(response);
}

export async function getAllReservations() {
    const response = await fetch(`${apiBaseUrl}/reservations`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
        }
    });
    return handleResponse(response);
}

export async function deleteReservationById(id){
    const response = await fetch(`${apiBaseUrl}/reservations/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
        }
    });
    return handleResponse(response);
}

export async function updateReservation(reservationId,reservation){
    const response = await fetch(`${apiBaseUrl}/reservations`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify({
            _id: reservationId,
            ...reservation
        })
    });
    return handleResponse(response);
}