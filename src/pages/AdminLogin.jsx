import React, { useState } from 'react'
import backgroundImage from '../assets/loginbg.avif';
import { useNavigate } from 'react-router-dom';
import { getStudent } from '../services/StudentService';
import { use } from 'react';
import { getAdmin } from '../services/AdminService';
import HrLine from '../components/HrLine';

const AdminLogin = ({setIsAuthenticated}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({
        username: '',
        password: '',
        account: ''
    });
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault();
        const data = {
            username: username.trim(),
            password: password.trim()
        };

        const errorObj = {
            username: '',
            password: '',
            account: ''
        }

        if (validate(data)) {

            setError(errorObj);

            getAdmin(username).then((response) => {
                if (response.status === 200) {
                    if (response.data.password === password) {
                        localStorage.setItem("currentUser", username)
                        setIsAuthenticated(true);
                        navigate('/admin')
                    }
                    else {
                        setError({
                            ...errorObj,
                            account: "Incorrect Password!"
                        });
                    }
                }
            })
                .catch(error => {
                    setError({
                        ...errorObj,
                        account: "Account does not exist for this register number"
                    });
                })
        }
    }

    function validate(data) {
        const errorObj = {
            username: '',
            password: '',
        }
        let isValid = true;

        if (!data.username) {
            errorObj.username = "Please enter the register number!";
            isValid = false;
        }
        if (!data.password) {
            errorObj.password = "Please enter the password!";
            isValid = false;
        }
        setError(errorObj);
        return isValid;
    }

    const divStyle = {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',

    };

    return (
        <div className='container-fluid d-flex justify-content-center align-items-center min-vh-100 ' style={divStyle}>
            <div className="row">
                <div className="card shadow p-2 mb-4  bg-body rounded-4" style={{ width: '400px' }}>
                    <h2 className='card-title text-center mt-3 fs-2' style={{ color: 'var(--color-head)' }}>Admin Login</h2>
                    <form className='form card-body'>
                        <div className='container-fluid mb-4'>
                            <label htmlFor="username" className='form-label fs-6' style={{ color: 'var(--color-head)' }}>Username:</label>
                            <input type="text"
                                name="username"
                      
                                className={`form-control  ${error.username ? 'is-invalid' : ''}`}
                                placeholder='Enter your username'
                                onChange={(e) => setUsername(e.target.value)}
                                value={username}
                            />
                            {error.username && <span className='invalid-feedback'>{error.username}</span>}
                        </div>
                        <div className='container-fluid mb-3'>
                            <label htmlFor="password" className='form-label fs-6' style={{ color: 'var(--color-head)' }}>Password:</label>
                            <input type="password"
                                name="password"
        
                                className={`form-control ${error.password ? 'is-invalid' : ''}`}
                                placeholder='Enter your password'
                                onChange={(e) => setPassword(e.target.value)}
                                value={password} />
                            {error.password && <span className='invalid-feedback'>{error.password}</span>}
                        </div>
                        <div className='container-fluid text-center mb-3'>
                            <button onClick={handleSubmit} className='btn btn-primary mt-3 w-50 fs-5'>
                                Login
                            </button>
                        </div>
                        <div className='container-fluid text-center mb-3'>
                            <input type='hidden' className={`container-fluid text-center ${error.account ? 'is-invalid' : ''}`} />
                            {error.account && <div className='invalid-feedback'>{error.account}</div>}
                        </div>
                        <HrLine/>
                        <div className='text-center mb-2'>
                            <a href="/" className="href">Student login</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin