import React, { useState } from 'react';
import '../styles/SignUp.css';
import TodoNavBar from './Navbar';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate=useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const URL='http://localhost:8001';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        console.log("Form Submitted:", formData);
        // Add sign-up logic here (API call, etc.)
        fetch(`${URL}/api/v1/user/register`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData)
    }).then((res)=>res.json()).
    then((data)=>{
      alert((prev)=>({
        ...prev,
        message:data.message,
      }));
      if(data.status=="Success"){
        setTimeout(()=>{
          navigate('/')

        },3000)
      }
    }).catch(err=>alert(err.message))
    };

    return (
        <>
        <TodoNavBar/>
            <div className="signup-container">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <h2>Create Account</h2>

                    <div className="form-head">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-head">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-head">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-head">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="signup-btn">Sign Up</button>
                </form>
            </div>
        </>
    );
};

export default SignUp;
