import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import { getAdmin, addCourse, updateCourse, deleteCourse } from '../services/AdminService';
import edit from '../assets/pencil.png'
import AddCourseDialog from '../components/AddCourseDialog';
import { toast } from 'react-toastify';
import UpdateCourseDialog from '../components/UpdateCourseDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { getReport } from '../services/ReportService';
import { getResponseCount } from '../services/CourseService';
import './AdminPage.css';

const AdminPage = () => {
    const currentUser = localStorage.getItem("currentUser");
    const [courses, setCourses] = useState([]);
    const [responseCounts, setResponseCounts] = useState({});
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState({});
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(0);

    const navigate = useNavigate();

    const fetchCourses = async () => {
        if (!currentUser) return;

        try {
            const response = await getAdmin(currentUser);
            setCourses(response.data.courses);
            setResponseCounts(response.data.responseCounts || {});
            localStorage.setItem("adminId", response.data.id);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [currentUser]);

    useEffect(() => {
        if (courses.length === 0) return;

        const pollResponses = async () => {
            try {
                const counts = await Promise.all(courses.map(course =>
                    getResponseCount(course.id).then(response => ({
                        courseId: course.id,
                        count: response.data
                    })).catch(() => ({ courseId: course.id, count: 0 }))
                ));

                const updatedCounts = counts.reduce((acc, { courseId, count }) => {
                    acc[`course${courseId}`] = count;
                    return acc;
                }, {});

                setResponseCounts(updatedCounts);
            } catch (error) {
                console.error("Error polling responses:", error);
            }
        };

        pollResponses();
        const interval = setInterval(pollResponses, 5000);

        return () => clearInterval(interval);
    }, [courses]);

    function handleLogout() {
        localStorage.clear();
        navigate("/admin-login", { replace: true });
    }

    function handleUpdateDialog(course) {
        setShowUpdateDialog(true);
        setSelectedCourse(course);
    }

    function handleDeleteCourse() {
        deleteCourse(selectedCourseId)
            .then(response => {
                if (response.status === 200) {
                    toast.success("Course deleted successfully");
                    fetchCourses();
                    setShowConfirmDialog(false);
                    setSelectedCourseId(null);
                } else {
                    toast.error("Failed to delete course. Please try again.");
                }
            })
            .catch(err => {
                toast.error("An error occurred while deleting the course ❌");
                console.error(err);
            });
    }

    const openConfirmDialog = (courseId) => {
        setSelectedCourseId(courseId);
        setShowConfirmDialog(true);
    };

    function handleDownload(id) {
        getReport(id)
            .then(response => {
                if (response.status === 200) {
                    const blob = new Blob([response.data], { type: response.headers['content-type'] });

                    let fileName = "Report.xlsx";
                    const contentDisposition = response.headers["content-disposition"];
                    if (contentDisposition) {
                        const match = contentDisposition.match(/filename="?([^"]+)"?/);
                        if (match && match[1]) {
                            fileName = decodeURIComponent(match[1]); 
                        }
                    }

                    const link = document.createElement("a");
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    toast.success("Course Report downloaded successfully");
                } else {
                    toast.error("Failed to download report. Please try again.");
                }
            })
            .catch(err => {
                toast.error("An error occurred while downloading the report ❌");
                console.error(err);
            });
    }

    return (
        <div>
            <nav className="navbar navbar-dark px-4 py-3 d-flex justify-content-between admin-navbar">
                <span className="navbar-brand mb-0 h1">Feedy</span>
                <div className="d-flex align-items-center gap-3">
                    <div className='user-info-box'>
                        <FaUser className="me-2" />
                        <span>{currentUser}</span>
                    </div>
                    <button className="btn btn-outline-light logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <div className='container-fluid px-4 py-4'>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Course Management</h4>
                    <button className='btn btn-primary d-flex align-items-center gap-2 px-3'
                        onClick={() => setShowAddDialog(true)}>
                        <span className="fs-5 mb-1">+</span>
                        Add Course
                    </button>
                </div>

                <div className="table-responsive rounded">
                    <table className="table table-hover mb-0 docker-table">
                        <thead>
                            <tr>
                                <th className="text-center">Course code</th>
                                <th className="text-center">Course name</th>
                                <th className="d-none d-md-table-cell text-center">Faculty name</th>
                                <th className="d-none d-md-table-cell text-center">Semester</th>
                                <th className="d-none d-md-table-cell text-center">Academic year</th>
                                <th className="text-center">Count</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => (
                                <tr key={course.id}>
                                    <td className="course-code text-center">{course.courseCode}</td>
                                    <td className="course-name text-center">{course.courseName}</td>
                                    <td className="d-none d-md-table-cell text-center">{course.facultyName}</td>
                                    <td className="d-none d-md-table-cell text-center">{course.semester}</td>
                                    <td className="d-none d-md-table-cell text-center">{course.academicYear}</td>
                                    <td>
                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                            <span className={`response-badge ${responseCounts[`course${course.id}`] === course.students.length ? 'complete' : 'incomplete'}`}>
                                                {responseCounts[`course${course.id}`] || 0}
                                            </span>
                                            <span className="text-muted">/</span>
                                            <span className="total-count">{course.students.length}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-4 justify-content-center">
                                            <div className="tooltip-container">
                                                <button className="btn btn-icon"
                                                    onClick={() => handleUpdateDialog(course)}>
                                                    <img src={edit} alt="Edit" width="16" height="16" />
                                                </button>
                                                <div className="tooltip">Edit Course</div>
                                            </div>
                                            <div className="tooltip-container">
                                                <button className="btn btn-icon" 
                                                    onClick={() => openConfirmDialog(course.id)}>
                                                    <FaTrash />
                                                </button>
                                                <div className="tooltip">Delete Course</div>
                                            </div>
                                            <div className="tooltip-container">
                                                <button
                                                    className={`btn btn-download ${responseCounts[`course${course.id}`] < course.students.length ? 'disabled' : ''}`}
                                                    disabled={responseCounts[`course${course.id}`] < course.students.length}
                                                    onClick={() => handleDownload(course.id)}>
                                                    Download
                                                </button>
                                                <div className="tooltip">
                                                    {responseCounts[`course${course.id}`] < course.students.length 
                                                        ? 'Complete all responses to download' 
                                                        : 'Download Report'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddCourseDialog
                show={showAddDialog}
                onClose={() => setShowAddDialog(false)}
                refreshCourses={fetchCourses}
            />
            <UpdateCourseDialog
                show={showUpdateDialog}
                course={selectedCourse}
                onClose={() => setShowUpdateDialog(false)}
                refreshCourses={fetchCourses}
            />
            <ConfirmDialog
                show={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={handleDeleteCourse}
                title="Delete Course"
                message="On deletion of a course all the collected responses will be cleared. Are you sure you want to delete this course?"
            />
        </div>
    )
}

export default AdminPage