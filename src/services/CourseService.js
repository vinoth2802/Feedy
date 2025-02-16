import axios from "axios";

const API_URL =`${import.meta.env.VITE_API_URL}/course`;

export const getResponseCount = (courseId) =>  axios.get(API_URL + "/response-count/" + courseId);


export const addCourse = (course) => axios.post(API_URL, course);

export const updateCourse = (id, course) => axios.put(API_URL + "/" + id, course);

export const deleteCourse =(id) => axios.delete(API_URL + "/" + id);
