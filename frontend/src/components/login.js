import React, { useState } from 'react';
import '../styles/SignIn.css';
import TodoNavBar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../AuthOparation';

const Login = () => {
    const URL='http://localhost:8001'
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate=useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        console.log('Form Submitted:', formData);
        // Add login logic here (e.g., API call)
    };
    const handleSignIn = (e) => {
        e.preventDefault();
        // if (!validateForm()) return;
        // setIsLoading(true);
        // setError('');
        // setSuccess('');
        // setIsLoading(false);
        fetch(`${URL}/api/v1/user/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        }).then((res) => res.json()).
            then((data) => {
                if (data.status === "Failed") {
                    alert(data.message);
                } else if (data.status === "Success" && data.token) {
                    setToken("token", data.token);
                    console.log('sucess',data.token);
                    alert('Login successful!');
                    navigate("/todo");
                } else {
                    alert("Unexpected response from server.");
                }
            }).catch((error) => {
                alert(error.message)
            })


    };
    return (
        <>
        <TodoNavBar/>

            <div className="signin-container">
                <form className="signin-form" onSubmit={handleSignIn}>
                    <h2>Sign In</h2>
                    <div className="form-head">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-head">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="signin-btn">Login</button>
                </form>
            </div>
        </>
    );
};

export default Login;
