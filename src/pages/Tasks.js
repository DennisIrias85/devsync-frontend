import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Tasks.css';
import SidebarMenu from '../components/SidebarMenu';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('');
  const [reminder, setReminder] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      toast.error('Error fetching tasks');
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) {
        toast.error('Task title cannot be empty!');
        return;
    }

    try {
        const payload = { 
            title: newTask, 
            description: '', 
            status: 'To Do', 
            category, 
            reminder: reminder ? new Date(reminder).toISOString() : null,
            dueDate: dueDate ? new Date(dueDate).toISOString() : null 
        };

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('No authentication token found. Please log in again.');
            return;
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        await API.post('/tasks', payload, config);
        setNewTask('');
        setCategory('');
        setReminder('');
        setDueDate('');
        fetchTasks();
        toast.success('Task added!');
    } catch (err) {
        console.error('Error adding task:', err);
        toast.error(err.response?.data?.message || 'Error adding task');
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
      fetchTasks();
      setShowDeleteModal(false);
      toast.success('Task deleted!');
    } catch (err) {
      toast.error('Error deleting task');
    }
  };

  return (
    <div className="tasks-container">
      <SidebarMenu />
      <ToastContainer />
      <h2>My Tasks</h2>
      <div className="form-container">
        <form onSubmit={addTask}>
          <input
            type="text"
            placeholder="Add a New Task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            required
          />
          <input 
            type="text" 
            placeholder="Set Due Date" 
            onFocus={(e) => e.target.type = 'datetime-local'} 
            onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Set Reminder (optional)" 
            onFocus={(e) => e.target.type = 'datetime-local'} 
            onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>
      </div>
      <ul className="tasks-list">
        {tasks.map((task) => (
          <li key={task._id} className={task.status === 'Completed' ? 'completed' : ''}>
            <div className="task-info">
              <p><strong>Title:</strong> {task.title}</p>
              <p><strong>Category:</strong> {task.category || 'N/A'}</p>
              <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
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
    </div>
  );
};

export default Tasks;
