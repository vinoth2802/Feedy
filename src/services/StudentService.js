import axios from "axios";

const API_URL =  `${import.meta.env.VITE_API_URL}/student`;

export const getStudent = (id) => {
    return axios.get(`${API_URL}/${id}`);
};