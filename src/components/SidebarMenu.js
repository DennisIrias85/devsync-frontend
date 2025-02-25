import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SidebarMenu.css';

const SidebarMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="sidebar-menu">
      <div className="menu-icon" onClick={() => setOpen(!open)}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {open && (
        <div className="menu-items">
          <button onClick={() => { navigate('/tasks'); setOpen(false); }}>My Tasks</button>
          <button onClick={() => { navigate('/tasks?filter=pending'); setOpen(false); }}>Pending Tasks</button>
          <button onClick={() => { navigate('/tasks?filter=completed'); setOpen(false); }}>Completed Tasks</button>
          <button onClick={() => { navigate('/tasks/new'); setOpen(false); }}>Add Task</button>
          <button onClick={() => { navigate('/tasks/categories'); setOpen(false); }}>By Category</button>
        </div>
      )}
    </div>
  );
};

export default SidebarMenu;
