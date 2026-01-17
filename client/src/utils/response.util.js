export const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
            status: response.status,
            message: errorData.message || `HTTP error! status: ${response.status}`,
            data: errorData
        };
    }
    return response.json();
};