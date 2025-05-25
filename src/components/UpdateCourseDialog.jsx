import React, { useState, useEffect } from 'react';
import '../css/dialog.css';
import { IoClose } from "react-icons/io5";
import { updateCourse } from '../services/CourseService';
import { toast } from 'react-toastify';

const UpdateCourseDialog = ({ show, course, onClose, refreshCourses }) => {

    const [courseData, setCourseData] = useState({
        courseCode: "",
        courseName: "",
        facultyName: "",
        semester: "",
        academicYear: "",
        studentRegisterNumbers: []
    });

    useEffect(() => {
        if (course) {
            setCourseData({
                courseCode: course.courseCode || "",
                courseName: course.courseName || "",
                facultyName: course.facultyName || "",
                semester: course.semester || "",
                academicYear: course.academicYear || "",
                studentRegisterNumbers: course.students || []
            });
        }
    }, [course]);


    console.log(course)
    console.log(courseData)
    const [error, setError] = useState({
        courseCode: "",
        courseName: "",
        facultyName: "",
        semester: "",
        academicYear: "",
        studentRegisterNumbers: "",
        account: ""
    });

    const handleChange = (e) => {
        setCourseData({ ...courseData, [e.target.name]: e.target.value });
    };

    const handleStudentsChange = (e) => {
        const studentArray = e.target.value.split(',').map(num => num.trim());
        setCourseData({ ...courseData, studentRegisterNumbers: studentArray });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            updateCourse(course.id, courseData)
                .then(response => {
                    if (response.status === 200) {
                        toast.success("Course updated successfully");
                        refreshCourses();
                        handleClose();
                    } else {
                        toast.error("Failed to update course. Please try again.");
                    }
                })
                .catch(err => {
                    toast.error("An error occurred while updating the course ❌");
                    console.error(err);
                });
        }
    };

    const handleClose = () => {
        setCourseData({
            courseCode: "",
            courseName: "",
            facultyName: "",
            semester: "",
            academicYear: "",
            studentRegisterNumbers: []
        });
        setError({});
        onClose();
    };


    function validate(data) {
        const errorObj = {
            courseCode: "",
            courseName: "",
            facultyName: "",
            semester: "",
            academicYear: "",
            studentRegisterNumbers: "",
            account: ""
        }
        let isValid = true;

        if (!courseData.courseCode) {
            errorObj.courseCode = "Please enter the Course Code!";
            isValid = false;
        }
        if (!courseData.courseName) {
            errorObj.courseName = "Please enter the Course Name!";
            isValid = false;
        }
        if (!courseData.facultyName) {
            errorObj.facultyName = "Please enter the Faculty Name!";
            isValid = false;
        }
        if (!courseData.academicYear) {
            errorObj.academicYear = "Please enter the Academic Year!";
            isValid = false;
        }
        if (!courseData.semester) {
            errorObj.semester = "Please select a Semester!";
            isValid = false;
        }
        if (!courseData.studentRegisterNumbers.length) {
            errorObj.studentRegisterNumbers = "Please enter the students register number list!";
            isValid = false;
        }

        if (!isValid) {
            errorObj.account = "Please fill all the fields!";
        }

        setError(errorObj);
        return isValid;
    }

    if (!show) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-box shadow-lg rounded-4 p-4 position-relative" style={{ width: '600px', background: 'white' }}>
                <button onClick={handleClose} className="btn btn-link position-absolute top-0 end-0 p-3 close-btn">
                    <IoClose size={32} color="#666" />
                </button>

                <h3 className='mb-4 fw-semibold text-primary' style={{ fontSize: '1.25rem' }}>Update Course</h3>
                <form onSubmit={handleSubmit}>
                    <div className="container-fluid px-0">
                        {[
                            { label: "Course Code", name: "courseCode", type: "text", placeholder: "Enter course code" },
                            { label: "Course Name", name: "courseName", type: "text", placeholder: "Enter course name" },
                            { label: "Faculty Name", name: "facultyName", type: "text", placeholder: "Enter faculty name" },
                            { label: "Academic Year", name: "academicYear", type: "text", placeholder: "Enter academic year" }
                        ].map((field, index) => (
                            <div className="row mb-1 align-items-center" key={index}>
                                <div className="col-3">
                                    <label htmlFor={field.name} className='form-label mb-0 text-dark'>{field.label}</label>
                                </div>
                                <div className="col">
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        id={field.name}
                                        className={`form-control ${error[field.name] ? 'is-invalid' : ''}`}
                                        onChange={handleChange}
                                        placeholder={field.placeholder}
                                        value={courseData[field.name]}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="row mb-4 align-items-center mt-3">
                            <div className="col-3">
                                <label htmlFor="semester" className='form-label mb-0 text-dark'>Semester</label>
                            </div>
                            <div className="col">
                                <select
                                    name="semester"
                                    id="semester"
                                    className={`form-select ${error.semester ? 'is-invalid' : ''}`}
                                    value={courseData.semester || ""}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Semester</option>
                                    <option value="ODD">ODD</option>
                                    <option value="EVEN">EVEN</option>
                                </select>
                            </div>
                        </div>

                        <div className="row mb-4 align-items-start">
                            <div className="col-3">
                                <label htmlFor="studentRegisterNumbers" className='form-label mb-0 text-dark'>
                                    Students List
                                </label>
                            </div>
                            <div className="col">
                                <textarea
                                    name="studentRegisterNumbers"
                                    id="studentRegisterNumbers"
                                    className={`form-control ${error.studentRegisterNumbers ? 'is-invalid' : ''}`}
                                    rows="4"
                                    placeholder="Enter register numbers separated by commas"
                                    onChange={handleStudentsChange}
                                    value={courseData.studentRegisterNumbers}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                        <button type="submit" className="btn btn-primary px-4">Update</button>
                    </div>

                </form>
                <style jsx>{`
                    .dialog-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    }
                    .dialog-box {
                        position: relative;
                        overflow: hidden;
                    }
                    .form-control, .form-select {
                        border: 1px solid #dee2e6;
                        transition: all 0.2s ease;
                        font-size: 0.9rem;
                    }
                    .form-control:focus, .form-select:focus {
                        border-color: #1a73e8;
                        box-shadow: 0 0 0 0.2rem rgba(26, 115, 232, 0.25);
                    }
                    .form-control.is-invalid, .form-select.is-invalid {
                        border-color: #dc3545;
                        padding-right: calc(1.5em + 0.75rem);
                        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
                        background-repeat: no-repeat;
                        background-position: right calc(0.375em + 0.1875rem) center;
                        background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
                    }
                    .btn-primary {
                        background: #1a73e8;
                        border: none;
                        padding: 0.5rem 1.25rem;
                        font-weight: 500;
                        font-size: 0.9rem;
                    }
                    .btn-primary:hover {
                        background: #1557b0;
                    }
                    .close-btn {
                        transition: all 0.2s ease;
                        opacity: 0.7;
                        transform-origin: center;
                        margin: 0.2rem 0.55rem 0 0;
                    }
                    .close-btn:hover {
                        opacity: 1;
                        transform: scale(1.1);
                    }
                    .close-btn:hover svg {
                        color: #dc3545 !important;
                    }
                    .form-label {
                        font-size: 0.9rem;
                        font-weight: 500;
                    }
                    textarea.form-control {
                        min-height: 80px;
                    }
                `}</style>
            </div>
        </div>
    );
};



export default UpdateCourseDialog