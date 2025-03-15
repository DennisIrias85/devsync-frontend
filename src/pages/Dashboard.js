import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import TaskModal from '../components/TaskModal';
import API from '../api/api';  
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const firstName = user && user.username ? user.username.split(' ')[0] : 'User';

    const [showTaskModal, setShowTaskModal] = useState(false);

    const handleSaveTask = async (taskData) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('No authentication token found. Please log in again.');
                return;
            }

            const config = { headers: { Authorization: `Bearer ${token}` } };

            const payload = {
                title: taskData.title,
                category: taskData.category,
                reminder: taskData.reminder ? new Date(taskData.reminder).toISOString() : null,
                dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null
            };

            const response = await API.post('/tasks', payload, config);

            if (response.status === 201) {
                toast.success('Task added successfully!');
                setShowTaskModal(false); 
            } else {
                throw new Error('Unexpected server response');
            }
        } catch (err) {
            console.error('Error adding task:', err);
            const errorMessage = err.response?.data?.message || 'Error adding task';
            toast.error(errorMessage);

            setShowTaskModal(true); 
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Hi {firstName}, Welcome to Your DevSync Dashboard!</h1>
            <div className="dashboard-options">
                <button className="dashboard-button" onClick={() => navigate('/tasks')}>
                    <div className="button-top">See My Tasks</div>
                    <div className="button-divider"></div>
                    <div className="button-bottom">View and manage your upcoming tasks.</div>
                </button>
                <button className="dashboard-button" onClick={() => setShowTaskModal(true)}>
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

            {showTaskModal && (
                <TaskModal 
                    closeModal={() => setShowTaskModal(false)} 
                    onSave={handleSaveTask} 
                />
            )}
        </div>
    );
};

export default Dashboard;