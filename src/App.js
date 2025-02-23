import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import './styles/Background.css';
import './App.css'

function App() {
    return (
        <div>
            <div className="background-lines"></div>
            <Router>
                <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;