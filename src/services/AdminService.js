import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/admin`;

export const getAdmin = async (username) => {
    return axios.get(`${API_URL}/${username}`);
};

export const addCourse = async (course) => {
    return axios.post(`${API_URL}/add-course`, course);
};

export const updateCourse = async (course) => {
    return axios.put(`${API_URL}/update-course`, course);
};

export const deleteCourse = async (courseId) => {
    return axios.delete(`${API_URL}/delete-course/${courseId}`);
};