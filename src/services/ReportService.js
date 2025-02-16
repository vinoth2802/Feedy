import axios from "axios";

const API_URL =`${import.meta.env.VITE_API_URL}/report`;


export const getReport = async (id) => {
    return axios.get(`${API_URL}/${id}`, {
        responseType: 'application/octet-stream',  
    });
};
