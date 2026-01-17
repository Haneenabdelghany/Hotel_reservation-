import { authService } from "../utils/auth.util";

export default class Navbar {
    constructor() {
        this.element = document.createElement('nav');
    }

    async render() {
        const isAuthenticated = await authService.isAuthenticated();
        const isAdmin = authService.isAdmin();

        this.element.innerHTML = `
            <nav class="navbar navbar-expand-lg bg-white border-bottom py-3">
                <div class="container-fluid px-4">
                    <a class="navbar-brand fw-semibold fs-4 d-flex align-items-center gap-2 text-dark fw-bold lh-1" href="/">
                        Hotel<br/>Reservation
                    </a>
                    <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul class="navbar-nav align-items-center gap-4">
                            <li>
                                <a class="btn btn-primary fs-6 fw-medium " href="/">Home</a>
                            </li>
                            <li>
                                <a class="btn btn-primary fs-6 fw-medium " href="/reservation">Book Now</a>
                            </li>
                            ${isAuthenticated && isAdmin ?
                                `<li>
                                    <a class="btn btn-primary fs-6 fw-medium " href="/dashboard">Dashboard</a>
                                </li>`:""}
                            ${isAuthenticated?
                                `<li><button class="btn btn-danger" id="logout-btn">Logout</button></li>`:
                                `
                                    <li><a class="btn btn-primary fs-6 fw-medium" href="/login">Login</a></li>
                                    <li><a class="btn btn-primary fs-6 fw-medium" href="/register">Register</a></li>
                                `}
                        </ul>
                    </div>
                </div>
            </nav>
        `;
        return this.element;
    }

    addLogoutListener(callback) {
        const logoutBtn = this.element.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', callback);
        }
    }

    getHtml() {
        return this.element;
    }
}
