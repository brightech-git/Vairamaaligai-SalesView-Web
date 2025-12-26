import axios from "axios";

const baseUrl = 'https://app.bmgjewellers.com/api/v1';

export const getCompanyDetails = async () => {
    try {
        const response = await axios.get(`${baseUrl}/company/all`);
        if (response.data) {
            return response.data;
        }
        return null;
    } catch (err) {
        throw new Error("Failed to get the Company Details");
    }
};
