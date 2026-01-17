import Loading from "../../components/Loading";
import "../../styles/main.css";
import { handleRouteAccess } from "../../utils/routeHandler.util";
import { register } from "../../utils/users.util";
import {
    validateEmail,
    validateName,
    validatePassword,
    validateConfirmPassword
} from '../../utils/validate.util';

const loading = new Loading();
document.body.prepend(loading.getHtml());
const container = document.getElementById('register-container');

handleRouteAccess().then((accessGranted) => {
    console.log(accessGranted)
    if (accessGranted) {
        loading.hide();
        container.style.display = 'block';
        initRegisterForm();
    }
});

function initRegisterForm() {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('register-form');

        // Function to reset validation states
        const resetValidation = () => {
            form.classList.remove('was-validated');
            form.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
                el.classList.remove('is-invalid', 'is-valid');
                const feedback = el.nextElementSibling;
                if (feedback && feedback.classList.contains('invalid-feedback')) {
                    feedback.textContent = '';
                }
            });
        };

        // Function to apply validation results
        const applyValidation = (fieldName, validation) => {
            const input = form.querySelector(`[name="${fieldName}"]`);
            const feedback = form.querySelector(`#${fieldName}-feedback`);

            if (!input || !feedback) return;

            if (validation.isValid) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
                feedback.innerHTML = '';
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');

                // Create a bullet list for multiple error messages
                if (validation.messages.length > 1) {
                    feedback.innerHTML = '<ul class="mb-0">' +
                        validation.messages.map(msg => `<li>${msg}</li>`).join('') +
                        '</ul>';
                } else {
                    feedback.textContent = validation.messages[0];
                }
            }
        };

        // Function to validate individual fields
        const validateField = (input) => {
            const value = input.value.trim();
            const name = input.name;

            let validationResult;

            switch (name) {
                case 'firstName':
                case 'lastName':
                    validationResult = validateName(value);
                    break;
                case 'email':
                    validationResult = validateEmail(value);
                    break;
                case 'password':
                    validationResult = validatePassword(value);
                    break;
                case 'confirmPassword':
                    validationResult = validateConfirmPassword(form.password.value, value);
                    break;
                default:
                    return;
            }

            applyValidation(name, validationResult);
            return validationResult.isValid;
        };

        // Validate all fields
        const validateAllFields = () => {
            let allValid = true;

            form.querySelectorAll('input').forEach(input => {
                const isValid = validateField(input);
                if (!isValid) allValid = false;
            });

            return allValid;
        };

        // Handle form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            resetValidation();

            const allValid = validateAllFields();

            if (allValid) {
                // Form is valid - prepare data for submission
                const formData = {
                    first_name: form.firstName.value.trim(),
                    last_name: form.lastName.value.trim(),
                    email: form.email.value.trim(),
                    password: form.password.value
                };

                // Here you would typically send data to your backend

                const response = await register(formData);
                console.log(response);
                if (response.data) {
                    location.href = '/login';
                }
            } else {
                form.classList.add('was-validated');
            }
        });

        // Real-time validation for better UX
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                if (form.classList.contains('was-validated')) {
                    validateField(input);
                }
            });

            input.addEventListener('blur', () => {
                validateField(input);
            });
        });
    });
}