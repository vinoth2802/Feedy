import React, { useEffect, useState } from 'react';
import { getStudent } from '../services/StudentService';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaBook, FaChalkboardTeacher, FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';

const StudentPage = () => {
    const currentUser = localStorage.getItem("currentUser");
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getStudent(currentUser)
            .then(response => setCourses(response.data.courses))
            .catch(error => console.error(error));
    }, [currentUser]);

    function goToFeedbackPage(course) {
        navigate(`/feedback/${course.id}/${course.courseCode}/${course.courseName}`);
    }

    function handleLogout() {
        localStorage.removeItem("currentUser");
        navigate("/", { replace: true });
    }

    return (
        <div className="min-vh-100 bg-light">
            {/* Modern Navbar */}
            <nav className="navbar navbar-dark px-4 py-3 d-flex justify-content-between" style={{
                background: 'linear-gradient(120deg, #1a73e8 0%, #4285f4 50%, #0d47a1 100%)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
                <span className="navbar-brand mb-0 h1">Feedy</span>
                <div className="d-flex align-items-center gap-3">
                    <div className='user-info-box'>
                        <FaUser className="me-2" />
                        <span>{currentUser}</span>
                    </div>
                    <button className="btn btn-outline-light logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container py-5">
                <div className="row mb-4">
                    <div className="col">
                        <h2 className="fw-bold text-primary mb-0">My Courses</h2>
                        <p className="text-muted">Manage your course feedback</p>
                    </div>
                </div>

                <div className="row g-4">
                    {courses.map((course) => (
                        <div key={course.id} className="col-12 col-md-6 col-lg-4">
                            <div className="card h-100 border-0 shadow-sm hover-shadow transition rounded-4">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h5 className="card-title fw-bold mb-1">{course.courseCode}</h5>
                                            <h6 className="text-muted mb-0">{course.courseName}</h6>
                                        </div>
                                        <span className="badge bg-primary rounded-pill px-3 py-2">
                                            {course.semester}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <div className="d-flex align-items-center mb-2">
                                            <FaChalkboardTeacher className="text-primary me-2" />
                                            <span className="text-muted">{course.facultyName}</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <FaGraduationCap className="text-primary me-2" />
                                            <span className="text-muted">{course.academicYear}</span>
                                        </div>
                                    </div>

                                    {!course.feedbackGiven ? (
                                        <button
                                            className="btn btn-primary w-100 rounded-pill py-2 shadow-sm"
                                            onClick={() => goToFeedbackPage(course)}
                                        >
                                            Give Feedback
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn btn-outline-secondary w-100 rounded-pill py-2 shadow-sm" 
                                            disabled
                                        >
                                            Feedback Submitted
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add custom styles */}
            <style jsx>{`
                .hover-shadow {
                    transition: all 0.3s ease;
                }
                .hover-shadow:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                }
                .transition {
                    transition: all 0.3s ease;
                }
                .card {
                    border-radius: 1rem !important;
                }
                .btn {
                    border-radius: 2rem !important;
                }
                .badge {
                    border-radius: 2rem !important;
                }
                .user-info-box {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 0.625rem 1.25rem;
                    border-radius: 6px;
                    color: white;
                    display: flex;
                    align-items: center;
                    font-weight: 500;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .logout-btn {
                    padding: 0.625rem 1.25rem;
                    border-radius: 6px !important;
                    font-weight: 500;
                    border-width: 2px;
                    transition: all 0.2s ease;
                }
                .logout-btn:hover {
                    background: white;
                    border-color: white;
                    color: #1a73e8;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
};

export default StudentPage;