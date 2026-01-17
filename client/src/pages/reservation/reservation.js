import "../../styles/main.css";
import {
    validateName,
    validatePhone,
    checkInSmallerThanCheckOut
} from '../../utils/validate.util';
import { getAllBranches } from '../../utils/branches.util';
import { handleRouteAccess } from "../../utils/routeHandler.util";
import Loading from "../../components/Loading";
import { addReservation } from "../../utils/reservations.util";
import Toast from 'bootstrap/js/dist/toast';

const loading = new Loading();
document.body.prepend(loading.getHtml());

const container = document.getElementById('reservation-container');
const form = document.getElementById('reservation-form');

handleRouteAccess().then((accessGranted) => {
    console.log(accessGranted);
    if (accessGranted) {
        loading.hide();
        container.style.display = 'block';
        initForm();
    }
});

function validateReservationForm(form) {
    let isValid = true;

    form.classList.remove('was-validated');
    [...form.elements].forEach(el => {
        el.classList.remove('is-invalid', 'is-valid');
        el.setCustomValidity('');
    });

    if (!form.checkValidity()) {
        isValid = false;
        [...form.elements].forEach(el => {
            if (!el.validity.valid) el.classList.add('is-invalid');
        });
    }

    const validateField = (input, validationFn) => {
        const result = validationFn(input.value.trim());
        if (!result.isValid) {
            isValid = false;
            input.classList.add('is-invalid');
            input.setCustomValidity(result.messages.join(' '));
            document.getElementById(`${input.name}-feedback`).textContent = result.messages.join(' ');
        }
    };

    validateField(form.firstName, validateName);
    validateField(form.lastName, validateName);
    validateField(form.phone, validatePhone);

    if (form.checkin.value && form.checkout.value) {
        const dateResult = checkInSmallerThanCheckOut(form.checkin.value, form.checkout.value);
        if (!dateResult.isValid) {
            isValid = false;
            form.checkout.classList.add('is-invalid');
            form.checkout.setCustomValidity(dateResult.messages.join(' '));
            document.querySelector('#checkout + .invalid-feedback').textContent = dateResult.messages.join(' ');
        }
    }

    form.classList.add('was-validated');
    return isValid;
}

async function initForm() {
    try {
        const { data: branches } = await getAllBranches();
        const branchSelect = document.getElementById('location');
        const roomTypeSelect = document.getElementById('roomType');
        const numRoomsInput = document.getElementById('numRooms');
        const numRoomsLabel = document.getElementById('numRoomsLabel');

        branches.forEach(branch => {
            const option = new Option(branch.name, branch._id);
            branchSelect.appendChild(option);
        });

        branchSelect.addEventListener('change', (e) => {
            const locationId = e.target.value;
            roomTypeSelect.innerHTML = '<option value disabled selected>Select room type</option>';

            const selectedBranch = branches.find(b => b._id === locationId);
            if (selectedBranch) {
                selectedBranch.rooms.forEach(room => {
                    const option = new Option(room.roomDetails.type, room.roomId);
                    roomTypeSelect.appendChild(option);
                });
            }
        });

        roomTypeSelect.addEventListener('change', (e) => {
            const locationId = branchSelect.value;
            const roomId = e.target.value;

            const selectedBranch = branches.find(b => b._id === locationId);
            if (selectedBranch) {
                const room = selectedBranch.rooms.find(r => r.roomId === roomId);
                if (room) {
                    const maxRooms = room.totalCount - room.reservedCount;
                    numRoomsInput.max = maxRooms;
                    numRoomsLabel.textContent = `Number of Rooms (${maxRooms} available)`;
                    const numRoomsFeedback = document.getElementById('numRooms-feedback');
                    numRoomsFeedback.textContent = `Please enter a number of rooms (1-${maxRooms}).`;

                    document.getElementById('breakfast').checked = room.roomDetails.meals.breakfast;
                    document.getElementById('lunch').checked = room.roomDetails.meals.lunch;
                    document.getElementById('dinner').checked = room.roomDetails.meals.dinner;
                }
            }
        });

    } catch (error) {
        console.error('Error initializing form:', error);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (validateReservationForm(form)) {
        const formData = new FormData(form);

        // Extract meals values (only checked checkboxes)
        const meals = [...form.querySelectorAll('input[name="meals"]')]
            .map(input => ({ [input.value]: input.checked }))
            .reduce((acc, curr) => ({ ...acc, ...curr }), {});

        // Convert to plain object, replacing 'meals' with array
        const data = Object.fromEntries(formData);
        data.meals = meals;

        const reservation = {
            branchID: data.location,
            roomID: data.roomType,
            numOfRooms: data.numRooms,
            guestName: data.firstName + ' ' + data.lastName,
            phoneNumber: data.phone,
            checkinDate: data.checkin,
            checkoutDate: data.checkout,
            meals: data.meals
        }
        const response = await addReservation(reservation);

        if (response.data) {
            const toastElement = document.getElementById("reservation-toast");
            const toast = new Toast(toastElement);
            toast.show();

            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        }
    }
});
