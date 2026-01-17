import { getBEURL } from "./be.util";

const apiBaseUrl = getBEURL();

export async function getAllBranches() {
    try {
        const response = await fetch(`${apiBaseUrl}/branches`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Get all branches failed:", error);
        throw error;
    }
}