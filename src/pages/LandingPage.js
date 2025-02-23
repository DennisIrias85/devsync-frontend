import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import '../styles/LandingPage.css';
import '../App.css';


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

export default LandingPage;
