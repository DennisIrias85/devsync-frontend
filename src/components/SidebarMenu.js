import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SidebarMenu.css';

const SidebarMenu = () => {
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
      {/* Hamburger icon moves with sidebar */}
      <div className="menu-icon" onClick={() => setOpen(!open)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Sidebar Menu */}
      <div className="sidebar-menu" ref={menuRef}>
        <button onClick={() => { navigate('/tasks'); setOpen(false); }}>My Tasks</button>
        <button onClick={() => { navigate('/tasks?filter=pending'); setOpen(false); }}>Pending Tasks</button>
        <button onClick={() => { navigate('/tasks?filter=completed'); setOpen(false); }}>Completed Tasks</button>
        <button onClick={() => { navigate('/tasks/new'); setOpen(false); }}>Add Task</button>
        <button onClick={() => { navigate('/tasks/categories'); setOpen(false); }}>By Category</button>
      </div>
    </div>
  );
};

export default SidebarMenu;
