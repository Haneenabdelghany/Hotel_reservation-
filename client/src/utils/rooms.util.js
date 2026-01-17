import { getBEURL } from "./be.util";

const apiBaseUrl = getBEURL();

export async function getRooms(limit) {
    try {
        const response = await fetch(`${apiBaseUrl}/rooms/${limit}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Get rooms failed:", error);
        throw error;
    }
}

