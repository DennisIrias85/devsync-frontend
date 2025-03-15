import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Tasks.css';
import SidebarMenu from '../components/SidebarMenu';
import TaskModal from '../components/TaskModal';

const fetchTasks = async (setTasks, location) => {
    const searchParams = new URLSearchParams(location.search);
    const filter = searchParams.get('filter');

    try {
        const { data } = await API.get(`/tasks${filter ? `?filter=${filter}` : ''}`);
        setTasks(data);
    } catch (err) {
        toast.error('Error fetching tasks');
    }
};

const Tasks = ({ openTaskModal }) => {
    const [tasks, setTasks] = useState([]);
    const [viewMode, setViewMode] = useState('detailed');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [menuOpen, setMenuOpen] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchTasks(setTasks, location);  
    }, [location]);

  const addTask = async (taskData) => {
    try {
      if (!taskData.title.trim()) {
        toast.error('Task title is required');
        return;
      }

      if (!taskData.dueDate) {
        toast.error('Due Date is required');
        return;
      }

      const payload = {
        title: taskData.title,
        category: taskData.category,
        reminder: taskData.reminder ? new Date(taskData.reminder).toISOString() : null,
        dueDate: new Date(taskData.dueDate).toISOString()
      };

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Please log in again.');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await API.post('/tasks', payload, config);

      if (response.status === 201) {
        toast.success('Task added successfully!');
        fetchTasks();
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



  const toggleTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'To Do' : 'Completed';
    try {
      await API.put(`/tasks/${id}`, { status: newStatus });
      fetchTasks();
      toast.success(`Task marked as ${newStatus}!`);
    } catch (err) {
      toast.error('Error updating task status');
    }
  };

  const openTaskDetail = (id) => {
    navigate(`/tasks/${id}`);
  };

  const confirmDeleteTask = (id) => {
    setTaskToDelete(id);
    setShowDeleteModal(true);
  };

  const deleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await API.delete(`/tasks/${taskToDelete}`);
      fetchTasks(setTasks, location);
      setShowDeleteModal(false);
      toast.success('Task deleted!');
    } catch (err) {
      toast.error('Error deleting task');
    }
  };

  return (
    <div className="tasks-container">
      <SidebarMenu openTaskModal={() => setShowTaskModal(true)} />
      <ToastContainer />
      <h2>My Tasks</h2>

      <div className="view-toggle-container">
        <div className="view-toggle">
          <button className={viewMode === 'detailed' ? 'active' : ''} onClick={() => setViewMode('detailed')}>
            Detailed View
          </button>
          <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
            List View
          </button>
        </div>
        <button className="add-task-btn" onClick={() => setShowTaskModal(true)}>
          + Add Task
        </button>
      </div>

      <ul className="tasks-list">
        {tasks.map((task) => (
          <li key={task._id} className={task.status === 'Completed' ? 'completed' : ''}>
            {viewMode === 'detailed' ? (
              <>
                <div className="task-info">
                  <p><strong>Title:</strong> {task.title}</p>
                  <p><strong>Category:</strong> {task.category || 'N/A'}</p>
                  <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'N/A'}</p>
                  <p><strong>Reminder:</strong> {task.reminder ? new Date(task.reminder).toLocaleString() : 'N/A'}</p>
                  <p><strong>Status:</strong> {task.status}</p>
                </div>
                <div className="task-actions">
                  <button className="details-btn" onClick={() => openTaskDetail(task._id)}>Details</button>
                  <button className="status-btn" onClick={() => toggleTaskStatus(task._id, task.status)}>
                    {task.status === 'Completed' ? 'Mark as To Do' : 'Mark as Completed'}
                  </button>
                  <button className="delete-btn" onClick={() => confirmDeleteTask(task._id)}>🗑</button>
                </div>
              </>
            ) : (
              <>
                <div className="task-list-item">
                  <div className="task-list-info">
                    <span className="task-title">{task.title}</span>
                    <span className="task-due-date">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <button className="menu-btn" onClick={() => setMenuOpen(menuOpen === task._id ? null : task._id)}>
                    ⋮
                  </button>
                  {menuOpen === task._id && (
                    <div className="task-menu">
                      <button onClick={() => openTaskDetail(task._id)}>Details</button>
                      <button onClick={() => toggleTaskStatus(task._id, task.status)}>
                        {task.status === 'Completed' ? 'Mark as To Do' : 'Mark as Completed'}
                      </button>
                      <button onClick={() => confirmDeleteTask(task._id)}>Delete</button>
                    </div>
                  )}
                </div>

              </>
            )}
          </li>
        ))}
      </ul>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this task?</p>
            <button onClick={deleteTask}>Yes, Delete</button>
            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showTaskModal && <TaskModal closeModal={() => setShowTaskModal(false)} onSave={addTask} />}
    </div>
  );
};

export default Tasks;

