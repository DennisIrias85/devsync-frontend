import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = ({ openTaskModal }) => {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const firstName = user && user.username ? user.username.split(' ')[0] : 'User';

    return (
        <div className="dashboard-container">
            <h1>Hi {firstName}, Welcome to Your DevSync Dashboard!</h1>
            <div className="dashboard-options">
                <button className="dashboard-button" onClick={() => navigate('/tasks')}>
                    <div className="button-top">See My Tasks</div>
                    <div className="button-divider"></div>
                    <div className="button-bottom">View and manage your upcoming tasks.</div>
                </button>
                <button className="dashboard-button" onClick={openTaskModal}>
                    <div className="button-top">Create New Task</div>
                    <div className="button-divider"></div>
                    <div className="button-bottom">Add a new task to stay organized.</div>
                </button>
                <button className="dashboard-button" onClick={() => navigate('/tasks?filter=completed')}>
                    <div className="button-top">Completed Tasks</div>
                    <div className="button-divider"></div>
                    <div className="button-bottom">Review tasks you've already completed.</div>
                </button>
            </div>
        </div>
    );
};

export default Dashboard;

