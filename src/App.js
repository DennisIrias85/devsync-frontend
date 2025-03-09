import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import SidebarMenu from './components/SidebarMenu';
import TaskModal from './components/TaskModal';
import './styles/Background.css';
import './App.css';

const AppContent = () => {
    const location = useLocation();
    const [showTaskModal, setShowTaskModal] = useState(false);

    const hideSidebarRoutes = ['/', '/login', '/register'];
    const shouldShowSidebar = !hideSidebarRoutes.includes(location.pathname);

    return (
        <div>
            <div className="background-lines"></div>
            {shouldShowSidebar && <SidebarMenu openTaskModal={() => setShowTaskModal(true)} />}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tasks" element={<Tasks openTaskModal={() => setShowTaskModal(true)} />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
                <Route path="/dashboard" element={<Dashboard openTaskModal={() => setShowTaskModal(true)} />} />
            </Routes>
            {showTaskModal && <TaskModal closeModal={() => setShowTaskModal(false)} />}
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;