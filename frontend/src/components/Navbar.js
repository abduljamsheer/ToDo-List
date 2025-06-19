import React, { useEffect, useState } from 'react';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../AuthOparation';

const TodoNavBar = () => {
const [menuOpen, setMenuOpen] = useState(false);
const [isLoggedIn, setIsLoggedIn] = useState(false);
const toggleMenu = () => setMenuOpen(!menuOpen);
const navigate=useNavigate()

  useEffect(() => {
    const token = getToken("token");
    setIsLoggedIn(!!token); 
  }, []);
  const handleLogout=()=>{
    alert('are you sure')
    removeToken("token")
    navigate('/')
  }
  return (
    <nav className="todo-navbar">
      <div className="nav-container">
        <div className="logo"> To-Do List</div>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="/home">Home</a></li>
          <li><a href="#">Tasks</a></li>
          <li><a href="#">About</a></li>
          {isLoggedIn ? (
            <li className='logout' onClick={handleLogout}>Logout</li>
          ) : (
            <>
              <li className='login' onClick={() => navigate('/')}>Login</li>
              <li className='signup' onClick={() => navigate('/signup')}>Signup</li>
            </>
          )}
        </ul>
        <div className="hamburger" onClick={toggleMenu}>
          <div className={`bar ${menuOpen ? 'rotate1' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'fade' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'rotate2' : ''}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default TodoNavBar;
