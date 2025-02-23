import React, { useEffect, useState } from 'react'
import { getStudent } from '../services/StudentService';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import { getAdmin } from '../services/AdminService';
import { deleteCourse, getResponseCount } from '../services/CourseService';
import edit from '../assets/pencil.png'
import AddCourseDialog from '../components/AddCourseDialog';
import { toast } from 'react-toastify';
import UpdateCourseDialog from '../components/UpdateCourseDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { getReport } from '../services/ReportService';

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

    const fetchCourses = () => {
        if (!currentUser) return;

        getAdmin(currentUser)
            .then(response => {
                setCourses(response.data.courses);
                localStorage.setItem("adminId", response.data.id);
            })
            .catch(error => {
                console.error("Error fetching admin data:", error);
            });
    };

    useEffect(() => {
        fetchCourses();
    }, [currentUser]);


    useEffect(() => {
        if (courses.length === 0) return;

        const pollResponses = async () => {
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
        };

        pollResponses();
        const interval = setInterval(pollResponses, 5000);

        return () => clearInterval(interval);
    }, [courses]);



    function fetchResponseCount(courseId) {
        getResponseCount(courseId)
            .then(response => {
                setResponseCounts(prevCounts => ({
                    ...prevCounts,
                    [`course${courseId}`]: response.data
                }));
            })
            .catch(err => console.log(err));
    }

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
                    <div className="col-5">
                        <button className='btn btn-primary'
                            onClick={() => setShowAddDialog(true)}>
                            Add Course +
                        </button>
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
                                    <th>Count</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                    <th>Report Status</th>
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
                                                <span
                                                    style={{
                                                        color: responseCounts[`course${course.id}`] === course.students.length ? "green" : "red",
                                                        marginRight: "5px"
                                                    }}>
                                                    {responseCounts[`course${course.id}`] || 0}
                                                </span>
                                                /
                                                <span style={{ color: "green", marginLeft: "5px" }}>{course.students.length}</span>
                                            </td>
                                            <td width={20}>
                                                <button className="btn"
                                                    onClick={() => handleUpdateDialog(course)} >
                                                    <img src={edit} alt="Edit" width="20" height="20" />
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn" onClick={() => openConfirmDialog(course.id)}>
                                                    <FaTrash />
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className='btn btn-success'
                                                    disabled={responseCounts[`course${course.id}`] < course.students.length}
                                                    style={{
                                                        cursor: responseCounts[`course${course.id}`] < course.students.length ? "not-allowed" : "pointer",
                                                        opacity: responseCounts[`course${course.id}`] < course.students.length ? 0.6 : 1
                                                    }}
                                                    onClick={() => handleDownload(course.id)}>
                                                    Download
                                                </button>


                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <ConfirmDialog
                            show={showConfirmDialog}
                            onClose={() => setShowConfirmDialog(false)}
                            onConfirm={handleDeleteCourse}
                            title="Delete Course"
                            message="On deletion of a course all the collected responses will be cleared. Are you sure you want to delete this course?"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminPage