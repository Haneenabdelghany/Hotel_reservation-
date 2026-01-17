import "../../styles/main.css";
import { handleRouteAccess } from "../../utils/routeHandler.util";
import { login } from "../../utils/users.util";
import { validateEmail } from '../../utils/validate.util';
import Loading from "../../components/Loading";

const loading = new Loading();
document.body.prepend(loading.getHtml());
const container = document.getElementById('login-container');

handleRouteAccess().then((accessGranted) => {
    console.log(accessGranted)
    if (accessGranted) {
        loading.hide();
        container.style.display = 'block';
        initLoginForm();
    }
});

function initLoginForm() {
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('login-form');
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
                feedback.textContent = validation.messages.join(' ');
            }
        };

        // Function to validate individual fields
        const validateField = (input) => {
            const value = input.value.trim();
            const name = input.name;

            let validationResult;

            switch (name) {
                case 'email':
                    validationResult = validateEmail(value);
                    break;
                default:
                    return { isValid: true, messages: [] };
            }

            applyValidation(name, validationResult);
            return validationResult.isValid;
        };

        // Validate all fields
        const validateAllFields = () => {
            let allValid = true;

            form.querySelectorAll('input[required]').forEach(input => {
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

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';

            try {
                if (!validateAllFields()) {
                    form.classList.add('was-validated');
                    return;
                }

                const credentials = {
                    email: form.email.value.trim(),
                    password: form.password.value
                };

                const response = await login(credentials);

                if (response.data) {
                    window.location.href = '/';
                }

            } catch (error) {
                console.error('Login failed:', error);

                // Show error to user
                const feedback = document.getElementById('password-feedback');
                if (feedback) {
                    feedback.textContent = error.message || 'Login failed. Please try again.';
                    feedback.style.display = 'block';
                }

            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login';
            }
        });

        // Real-time validation for better UX
        form.querySelectorAll('input[required]').forEach(input => {
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

