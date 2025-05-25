import './App.css'
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StudentLogin from './pages/StudentLogin'
import AdminLogin from './pages/AdminLogin'
import ProtectedRoute from './components/ProtectedRoute'
import StudentPage from './pages/StudentPage'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import FeedbackPage from './pages/FeedbackPage'
import AdminPage from './pages/AdminPage'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Favicon from './components/Favicon'


function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("currentUser") !== null);
	useEffect(() => {
		const handleStorageChange = () => {
			setIsAuthenticated(localStorage.getItem("currentUser") !== null);
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	return (
		<>
			<ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
			<Router>
				<Favicon />
				<Routes>
					<Route path='/' element={<StudentLogin setIsAuthenticated={setIsAuthenticated}  />}></Route>
					<Route path='/admin-login' element={<AdminLogin setIsAuthenticated={setIsAuthenticated}  />}></Route>
					<Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
						<Route path='/student' element={<StudentPage />}></Route>
						<Route path='/feedback/:courseId/:courseCode/:courseName' element={<FeedbackPage />}></Route>
						<Route path='/admin' element={<AdminPage />}></Route>
					</Route>
				</Routes>
			</Router>
		</>
	)
}

export default App
