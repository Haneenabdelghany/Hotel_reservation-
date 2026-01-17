import { handleResponse } from './response.util';
import { AUTH_KEYS, SESSION_TIMEOUT, USER_ROLES } from '../config/constants.config';
import { getBEURL } from "./be.util";

const apiBaseUrl = getBEURL();

export const authService = {
    // Session management
    createSession: (token, userData) => {
        sessionStorage.setItem(AUTH_KEYS.TOKEN, token);
        sessionStorage.setItem(AUTH_KEYS.USER, JSON.stringify(userData));
        sessionStorage.setItem(AUTH_KEYS.TIMESTAMP, Date.now());
    },

    destroySession: () => {
        Object.values(AUTH_KEYS).forEach(key => sessionStorage.removeItem(key));
    },

    // Authentication checks
    isAuthenticated: async function () {
        const token = sessionStorage.getItem(AUTH_KEYS.TOKEN);
        const timestamp = sessionStorage.getItem(AUTH_KEYS.TIMESTAMP);

        if (!token || !timestamp) return false;
        if (Date.now() - Number(timestamp) > SESSION_TIMEOUT) {
            this.destroySession();
            return false;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/user/validate-token`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await handleResponse(response);
            return true;
        } catch (error) {
            this.destroySession();
            return false;
        }
    },

    getCurrentUser: () => {
        const user = sessionStorage.getItem(AUTH_KEYS.USER);
        return user ? JSON.parse(user) : null;
    },

    getToken: () => sessionStorage.getItem(AUTH_KEYS.TOKEN),

    // Check if user has admin role
    isAdmin: function () {
        const user = this.getCurrentUser();
        return user && user.isAdmin;
    },

    // Route protection
    protectRoute: async function (redirectUrl = '/login') {
        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
            this.destroySession();
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    // Admin route protection
    protectAdminRoute: async function (redirectUrl = '/') {
        const isAuth = await this.isAuthenticated();
        const isAdmin = this.isAdmin();

        if (!isAuth || !isAdmin) {
            if (!isAuth) this.destroySession();
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    blockAuthenticated: async function (redirectUrl = '/') {
        const isAuth = await this.isAuthenticated();
        if (isAuth) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    },

    // Neutral route handler (no redirects)
    checkAuthState: async function () {
        return await this.isAuthenticated();
    }
};