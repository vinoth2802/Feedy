import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/response`;

export const addFeedback = (courseId, studentId, feedback) => {
    return axios.post(`${API_URL}/${courseId}`, { ...feedback, studentId })
};

