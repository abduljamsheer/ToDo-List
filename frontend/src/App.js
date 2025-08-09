import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TodoNavBar from './components/Navbar';
import Login from './components/login';
import SignUp from './components/signup';
import TodoApp from './components/Todo';
import HomePage from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const NotFound = () => {
    return (
      <h1 className='not-found'>
        404 Not Found
      </h1 >
    )
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/todo' element={<ProtectedRoute>
          <TodoApp />
        </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
