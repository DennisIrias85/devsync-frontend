import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Logo from './components/Logo';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';


const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <Logo />
            <h1>Welcome to DevSync</h1>
            <div className="button-group">
                <button onClick={() => navigate('/register')}>Create an account</button>
                <button onClick={() => navigate('/login')}>I have an account</button>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> 
            </Routes>
        </Router>
    );
}

export default App;
