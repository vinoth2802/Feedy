import React, { useState } from 'react';
import '../css/dialog.css';
import { IoClose } from "react-icons/io5";
import { addCourse } from '../services/CourseService';
import { toast } from 'react-toastify';

const AddCourseDialog = ({ show, onClose,refreshCourses  }) => {
    const [courseData, setCourseData] = useState({
        adminId : Number.parseInt(localStorage.getItem("adminId")),
        courseCode: "",
        courseName: "",
        facultyName: "",
        semester: "",
        academicYear: "",
        students: []
    });
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
        setCourseData({ ...courseData, students: studentArray });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            addCourse(courseData)
                .then(response => {
                    if (response.status === 200) {
                        toast.success("New course added successfully");
                        refreshCourses();  
                        handleClose();
                    } else {
                        toast.error("Failed to add course. Please try again.");
                    }
                })
                .catch(err => {
                    toast.error("An error occurred while adding the course ❌");
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
            students: []
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
        if (!courseData.students.length) {
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
            <div className="dialog-box shadow p-4 position-relative" style={{ width: '600px' }}>
                <button onClick={handleClose} className="btn btn-link position-absolute top-0 end-0 button-close">
                    <IoClose size={30} color="black" />
                </button>

                <h3 className='mb-3'>Add New Course</h3>
                <form onSubmit={handleSubmit}>
                    <div className="container-fluid">
                        {[
                            { label: "Course Code", name: "courseCode", type: "text" },
                            { label: "Course Name", name: "courseName", type: "text" },
                            { label: "Faculty Name", name: "facultyName", type: "text" },
                            { label: "Academic Year", name: "academicYear", type: "text" }
                        ].map((field, index) => (
                            <div className="row mb-2 align-items-center" key={index}>
                                <div className="col-3 d-flex justify-content-start align-items-center">
                                    <label htmlFor={field.name} className='form-label mb-0'>{field.label}</label>
                                </div>
                                <div className="col-auto px-0 d-flex justify-content-center align-items-center">
                                    <span className="fw-bold">:</span>
                                </div>
                                <div className="col">
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        className={`form-control  ${error[field.name] ? 'is-invalid' : ''}`}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="row mb-4 align-items-center">
                            <div className="col-3 d-flex justify-content-start align-items-center">
                                <label htmlFor="semester" className='form-label mb-0'>Semester</label>
                            </div>
                            <div className="col-auto px-0 d-flex justify-content-center align-items-center">
                                <span className="fw-bold">:</span>
                            </div>
                            <div className="col">
                                <select
                                    name="semester"
                                    className={`form-select  ${error.semester ? 'is-invalid' : ''}`}
                                    value={courseData.semester || ""}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Semester</option>
                                    <option value="ODD">ODD</option>
                                    <option value="EVEN">EVEN</option>
                                </select>
                            </div>
                        </div>

                        <div className="row mb-4 align-items-center">
                            <div className="col-3 d-flex justify-content-start align-items-center">
                                <label htmlFor="studentRegisterNumbers" className='form-label mb-0'>
                                    Students List
                                </label>
                            </div>
                            <div className="col-auto px-0 d-flex justify-content-center align-items-center">
                                <span className="fw-bold">:</span>
                            </div>
                            <div className="col">
                                <textarea
                                    name="studentRegisterNumbers"
                                    className={`form-control  ${error.studentRegisterNumbers ? 'is-invalid' : ''}`}
                                    rows="3"
                                    placeholder="Enter register numbers separated by commas"
                                    onChange={handleStudentsChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center gap-2 mt-4">
                        <button type="submit" className="btn btn-primary px-5">Add</button>
                    </div>


                    {error.account && (
                        <div className="text-danger text-center mt-2">
                            {error.account}
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
};

export default AddCourseDialog;
