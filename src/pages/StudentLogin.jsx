import React, { useState } from 'react'
import backgroundImage from '../assets/loginbg.avif';
import { useNavigate } from 'react-router-dom';
import { getStudent } from '../services/StudentService';
import HrLine from '../components/HrLine';

const StudentLogin = ({setIsAuthenticated }) => {
    const [regno, setRegno] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({
        regno: '',
        password: '',
        account: ''
    });
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault();
        const data = {
            regno: regno.trim(),
            password: password.trim()
        };

        const errorObj = {
            regno: '',
            password: '',
            account: ''
        }

        if (validate(data)) {

            setError(errorObj);

            getStudent(regno).then((response) => {
                if (response.status === 200) {
                    if (response.data.password === password) {
                        localStorage.setItem("currentUser", regno)
                        setIsAuthenticated(true);
                        navigate('/student')
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
            regno: '',
            password: '',
        }
        let isValid = true;

        if (!data.regno) {
            errorObj.regno = "Please enter the register number!";
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
                <div className="card shadow p-2 mb-4  bg-body rounded-4" style={{ width: '400px'}}>
                    <h2 className='card-title text-center mt-3 fs-2' style={{ color: 'var(--color-head)' }}>Student Login</h2>
                    <form className='form card-body'>
                        <div className='container-fluid mb-4'>
                            <label htmlFor="username" className='form-label fs-6' style={{ color: 'var(--color-head)' }}>Register Number:</label>
                            <input type="text"
                                name="regno"
                                className={`form-control  ${error.regno ? 'is-invalid' : ''}`}
                                placeholder='Enter your register number'
                                onChange={(e) => setRegno(e.target.value)}
                                value={regno}
                            />
                            {error.regno && <span className='invalid-feedback'>{error.regno}</span>}
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
                            <a href="/admin-login" className="href">admin login</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default StudentLogin

