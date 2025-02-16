import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/admin/`;

export const getAdmin =(username) => axios.get(API_URL + username);