import "../../../styles/main.css";
import {
    validateName,
    validatePhone,
    checkInSmallerThanCheckOut
} from '../../../utils/validate.util';
import { getReservationById, updateReservation } from '../../../utils/reservations.util';
import { getAllBranches } from '../../../utils/branches.util';
import { handleRouteAccess } from "../../../utils/routeHandler.util";
import Loading from "../../../components/Loading";
import Toast from 'bootstrap/js/dist/toast';

const loading = new Loading();
document.body.prepend(loading.getHtml());

const container = document.getElementById('reservation-edit-container');
const form = document.getElementById('reservation-edit-form');
const reservationId = new URLSearchParams(window.location.search).get('id');

handleRouteAccess().then(async (accessGranted) => {
    if (accessGranted) {
        loading.hide();
        container.style.display = 'block';
        const { reservation, branches } = await loadReservationData();
        await populateBranches(reservation, branches);
    }
});

async function populateBranches(reservation, branches) {
    const locationSelect = document.getElementById('location');

    locationSelect.innerHTML = '<option value disabled selected>Select location</option>';
    branches.forEach(branch => {
        const option = new Option(branch.name, branch._id);
        if (branch._id === reservation.branchID._id) option.selected = true;
        locationSelect.appendChild(option);
    });

    const roomTypeSelect = document.getElementById('roomType');
    roomTypeSelect.innerHTML = '<option value disabled selected>Select room type</option>';
    const selectedBranch = branches.find(b => b._id === locationSelect.value);
    if (selectedBranch) {
        selectedBranch.rooms.forEach(room => {
            const option = new Option(room.roomDetails.type, room.roomId);
            if (room.roomId === reservation.roomID._id) option.selected = true;
            roomTypeSelect.appendChild(option);
        });
    }

    locationSelect.addEventListener('change', () => {
        const roomTypeSelect = document.getElementById('roomType');
        const numRoomsInput = document.getElementById('numRooms');
        const numRoomsLabel = document.getElementById('numRoomsLabel');
        const selectedBranch = branches.find(b => b._id === locationSelect.value);
        roomTypeSelect.innerHTML = '<option value disabled selected>Select room type</option>';
        if (selectedBranch) {
            selectedBranch.rooms.forEach(room => {
                const option = new Option(room.roomDetails.type, room.roomId);
                if (room.roomId === reservation.roomID._id) option.selected = true;
                roomTypeSelect.appendChild(option);
            });
        }
        numRoomsInput.value = '';
        numRoomsInput.max = '';
        numRoomsLabel.textContent = 'Number of Rooms';
        document.getElementById('numRooms-feedback').textContent = '';
    });

    roomTypeSelect.addEventListener('change', () => {
        const locationSelect = document.getElementById('location');
        const numRoomsInput = document.getElementById('numRooms');
        const numRoomsLabel = document.getElementById('numRoomsLabel');
        const selectedBranch = branches.find(b => b._id === locationSelect.value);
        if (!selectedBranch) return;
        const selectedRoom = selectedBranch.rooms.find(r => r.roomId === roomTypeSelect.value);
        if (!selectedRoom) return;
        const maxRooms = selectedRoom.totalCount - selectedRoom.reservedCount;
        numRoomsInput.max = maxRooms;
        numRoomsLabel.textContent = `Number of Rooms (${maxRooms} available)`;
        document.getElementById('numRooms-feedback').textContent = `Please enter a number of rooms (1-${maxRooms}).`;
    });
}

async function loadReservationData() {
    const { data: reservation } = await getReservationById(reservationId);
    const { data: branches } = await getAllBranches();

    // Set initial values for display
    const branch = branches.find(b => b._id === reservation.branchID._id);
    document.getElementById('location-initial').textContent = branch ? branch.name : 'Unknown location';

    const room = branch?.rooms.find(r => r.roomId === reservation.roomID._id);
    document.getElementById('roomType-initial').textContent = room ? room.roomDetails.type : 'Unknown room';
    document.getElementById('numRooms-initial').textContent = reservation.numOfRooms;
    document.getElementById('checkin-initial').textContent = reservation.checkinDate.split('T')[0];
    document.getElementById('checkout-initial').textContent = reservation.checkoutDate.split('T')[0];

    const [firstName, lastName = ''] = reservation.guestName.split(' ');
    document.getElementById('firstName-initial').textContent = firstName;
    document.getElementById('lastName-initial').textContent = lastName;
    document.getElementById('phone-initial').textContent = reservation.phoneNumber;

    // Set original meals selection
    const meals = [];
    if (reservation.meals.breakfast) meals.push('Breakfast');
    if (reservation.meals.lunch) meals.push('Lunch');
    if (reservation.meals.dinner) meals.push('Dinner');
    document.getElementById('meals-initial').textContent = meals.join(', ') || 'None';

    console.log()
    // Set form values
    form.numRooms.value = reservation.numOfRooms;
    form.numRooms.max = room.totalCount - room.reservedCount;
    form.checkin.value = reservation.checkinDate.split('T')[0];
    form.checkout.value = reservation.checkoutDate.split('T')[0];
    form.firstName.value = firstName;
    form.lastName.value = lastName;
    form.phone.value = reservation.phoneNumber;
    document.getElementById('breakfast').checked = reservation.meals.breakfast;
    document.getElementById('lunch').checked = reservation.meals.lunch;
    document.getElementById('dinner').checked = reservation.meals.dinner;

    return {
        reservation,
        branches
    };
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log(validateForm(form));
    if (validateForm(form)) {
        const formData = new FormData(form);
        const meals = [...form.querySelectorAll('input[name="meals"]')]
            .reduce((acc, input) => ({ ...acc, [input.value]: input.checked }), {});
        const data = Object.fromEntries(formData);
        data.meals = meals;
        const updatedReservation = {
            branchID: data.location,
            roomID: data.roomType,
            numOfRooms: Number(data.numRooms),
            guestName: data.firstName.trim() + ' ' + data.lastName.trim(),
            phoneNumber: data.phone.trim(),
            checkinDate: data.checkin,
            checkoutDate: data.checkout,
            meals: data.meals
        };
        const response = await updateReservation(reservationId, updatedReservation);
        if (response.data) {
            const toastElement = document.getElementById("reservation-toast");
            const toast = new Toast(toastElement);
            toast.show();

            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 2000);
        }
    }
});

function validateForm(form) {
    let valid = true;
    const errorElements = form.querySelectorAll('.invalid-feedback');
    errorElements.forEach(el => el.textContent = '');
    if (!validateName(form.firstName.value)) {
        setError('firstName-feedback', 'Please enter a valid first name.');
        valid = false;
    }
    if (!validateName(form.lastName.value)) {
        setError('lastName-feedback', 'Please enter a valid last name.');
        valid = false;
    }
    if (!validatePhone(form.phone.value)) {
        setError('phone-feedback', 'Please enter a valid phone number.');
        valid = false;
    }
    if (!checkInSmallerThanCheckOut(form.checkin.value, form.checkout.value)) {
        setError('checkout-feedback', 'Checkout date must be after check-in date.');
        valid = false;
    }
    if (!form.location.value) {
        setError('location-feedback', 'Please select a location.');
        valid = false;
    }
    if (!form.roomType.value) {
        setError('roomType-feedback', 'Please select a room type.');
        valid = false;
    }
    const numRooms = Number(form.numRooms.value);
    const maxRooms = Number(form.numRooms.max) || 0;
    console.log(numRooms, maxRooms);
    if (isNaN(numRooms) || numRooms < 1 || numRooms > maxRooms) {
        setError('numRooms-feedback', `Please enter a valid number of rooms (1-${maxRooms}).`);
        valid = false;
    }
    return valid;
}

function setError(feedbackId, message) {
    const feedbackEl = document.getElementById(feedbackId);
    if (feedbackEl) {
        feedbackEl.textContent = message;
    }
}