import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/student/`;

console.log(API_URL);

export const getStudent =(id) => axios.get(API_URL + id);