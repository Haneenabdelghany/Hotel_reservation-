import { authService } from "./auth.util";
import { getBEURL } from "./be.util";
import { handleResponse } from "./response.util";

const apiBaseUrl = getBEURL();

export const register = async (user) => {
    const response = await fetch(`${apiBaseUrl}/user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    return handleResponse(response);
};

export const login = async (credentials) => {
    const response = await fetch(`${apiBaseUrl}/user/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
    const { data, message } = await handleResponse(response);
    if (data) {
        const { token, ...user } = data;
        authService.createSession(token, user);
    }
    return { data, message };
};