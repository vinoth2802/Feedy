import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getAdmin } from '../services/AdminService';
import { FaUserShield, FaLock, FaSignInAlt, FaExclamationCircle } from 'react-icons/fa';

const AdminLogin = ({setIsAuthenticated}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({
        username: '',
        password: '',
        account: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

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
                console.error("Login error:", error);
                setError({
                    ...errorObj,
                    account: "Account does not exist for this username"
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }

    function validate(data) {
        const errorObj = {
            username: '',
            password: '',
        }
        let isValid = true;

        if (!data.username) {
            errorObj.username = "Please enter the username!";
            isValid = false;
        }
        if (!data.password) {
            errorObj.password = "Please enter the password!";
            isValid = false;
        }
        setError(errorObj);
        return isValid;
    }

    return (
        <div className='d-flex justify-content-center align-items-center login-container'>
            <div className="login-card">
                <div className="login-header">
                    <div className="d-flex align-items-center justify-content-center mb-3">
                        <FaUserShield className="login-icon me-3" />
                        <h2 className="mb-0">Admin Login</h2>
                    </div>
                </div>

                <form className='login-form' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="username">
                            <FaUserShield className="input-icon" />
                            Username
                        </label>
                        <input 
                            type="text"
                            id="username"
                            name="username"
                            className={`form-control ${error.username ? 'is-invalid' : ''}`}
                            placeholder='Enter your username'
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            autoComplete="username"
                        />
                        {error.username && <div className='invalid-feedback'>{error.username}</div>}
                    </div>

                    <div className='form-group'>
                        <label htmlFor="password">
                            <FaLock className="input-icon" />
                            Password
                        </label>
                        <input 
                            type="password"
                            id="password"
                            name="password"
                            className={`form-control ${error.password ? 'is-invalid' : ''}`}
                            placeholder='Enter your password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            autoComplete="current-password"
                        />
                        {error.password && <div className='invalid-feedback'>{error.password}</div>}
                    </div>

                    {error.account && (
                        <div className='alert alert-danger d-flex align-items-center'>
                            <FaExclamationCircle className="me-2" />
                            {error.account}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className='btn btn-primary login-button'
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>

                    <div className='divider-container'>
                        <div className='divider-line'></div>
                        <span className='divider-text'>or</span>
                        <div className='divider-line'></div>
                    </div>

                    <div className='text-center'>
                        <a href="/" className="student-link">
                            Student Login
                        </a>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .login-container {
                    position: relative;
                    min-height: 100vh;
                    width: 100%;
                    background: linear-gradient(
                        120deg,
                        #1a73e8 0%,
                        #4285f4 50%,
                        #0d47a1 100%
                    );
                }
                .login-card {
                    position: relative;
                    background: #ffffff;
                    border-radius: 15px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                    padding: 2.5rem;
                    width: 100%;
                    max-width: 420px;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                }
                .login-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .login-icon {
                    font-size: 2rem;
                    color: #1a1a1a;
                }
                .login-header h2 {
                    color: #1a1a1a;
                    font-weight: 600;
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: flex;
                    align-items: center;
                    color: #1a1a1a;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }
                .input-icon {
                    margin-right: 0.5rem;
                    color: #1a1a1a;
                }
                .form-control {
                    padding: 0.75rem 1rem;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    background: #ffffff;
                }
                .form-control:focus {
                    border-color: #0d6efd;
                    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
                    background: #ffffff;
                }
                .login-button {
                    width: 100%;
                    padding: 0.75rem;
                    font-size: 1rem;
                    font-weight: 500;
                    border-radius: 8px;
                    background: #0d6efd;
                    border: none;
                    transition: all 0.2s ease;
                }
                .login-button:hover {
                    background: #0b5ed7;
                    transform: translateY(-1px);
                }
                .login-button:active {
                    transform: translateY(0);
                }
                .divider-container {
                    display: flex;
                    align-items: center;
                    margin: 1.5rem 0;
                }
                .divider-line {
                    flex: 1;
                    height: 1px;
                    background-color: #e9ecef;
                }
                .divider-text {
                    padding: 0 1rem;
                    color: #6c757d;
                    font-size: 0.875rem;
                }
                .student-link {
                    color: #1a1a1a;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                .student-link:hover {
                    color: #000000;
                }
                .invalid-feedback {
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                }
                .alert {
                    border-radius: 8px;
                    padding: 0.75rem 1rem;
                    margin-bottom: 1rem;
                }
            `}</style>
        </div>
    )
}

export default AdminLogin