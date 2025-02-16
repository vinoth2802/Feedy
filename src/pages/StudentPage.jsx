import React, { useEffect, useState } from 'react'
import { getStudent } from '../services/StudentService';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const StudentPage = () => {
    const currentUser = localStorage.getItem("currentUser");
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getStudent(currentUser)
            .then(response => setCourses(response.data.courses))
            .catch(error => console.log(error))
        console.log(courses)
    }, [currentUser]);

    function goToFeedbackPage(course) {
        console.log(course)
        navigate(`/feedback/${course.id}/${course.courseCode}/${course.courseName}`);
    }

    function handleLogout() {
        localStorage.removeItem("currentUser");
        navigate("/", { replace: true });
    }
    return (
        <div>
            <nav className="navbar navbar-dark bg-dark px-3 d-flex justify-content-between">
                <span className="navbar-brand mb-0 h1">Feedy</span>
                <div className="d-flex align-items-center gap-3 me-2">
                    <div className='p-2 border border-primary rounded'>
                        <span className="text-white me-3"><FaUser className="me-2" /> {currentUser}</span>
                    </div>
                    <button className="btn btn-danger p-2" onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <div className='container-fluid'>
                <div className="row" style={{ height: '30px' }}></div>
                <div className="row">
                    <div className="cols-12">
                        <table className="table table-bordered text-center">
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Course Name</th>
                                    <th className="d-none d-md-table-cell">Faculty Name</th>
                                    <th className="d-none d-md-table-cell">Semester</th>
                                    <th className="d-none d-md-table-cell">Academic Year</th>
                                    <th>Feedback Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    courses.map((course, index) => (
                                        <tr key={index}>
                                            <td>{course.courseCode}</td>
                                            <td>{course.courseName}</td>
                                            <td className="d-none d-md-table-cell">{course.facultyName}</td>
                                            <td className="d-none d-md-table-cell">{course.semester}</td>
                                            <td className="d-none d-md-table-cell">{course.academicYear}</td>
                                            <td>
                                                {
                                                    !course.feedbackGiven ? (
                                                        <button
                                                            className="btn btn-success"
                                                            onClick={() => goToFeedbackPage(course)}
                                                        >
                                                            Give Feedback
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-secondary" style={{ cursor: 'not-allowed' }}>Feedback Given</button>
                                                    )
                                                }

                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentPage