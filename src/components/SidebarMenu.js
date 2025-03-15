import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SidebarMenu.css';

const SidebarMenu = ({ openTaskModal }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`sidebar-container ${open ? 'open' : ''}`}>
            <div className="menu-icon" onClick={() => setOpen(!open)}>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <div className="sidebar-menu" ref={menuRef}>
                <button onClick={() => { navigate('/dashboard'); setOpen(false); }}>My Dashboard</button>
                <button onClick={() => { navigate('/tasks'); setOpen(false); }}>My Tasks</button>
                <button onClick={() => { navigate('/tasks?filter=pending'); setOpen(false); }}>My Pending Tasks</button>
                <button onClick={() => { navigate('/tasks?filter=completed'); setOpen(false); }}>My Completed Tasks</button>
                <button onClick={() => { navigate('/tasks/categories'); setOpen(false); }}>Tasks by Category</button>
                <button onClick={() => { openTaskModal(); setOpen(false); }}>Add a New Task</button>
            </div>
        </div>
    );
};

export default SidebarMenu;

