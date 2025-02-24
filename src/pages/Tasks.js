import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('');
  const [reminder, setReminder] = useState('');
  const [dueDate, setDueDate] = useState('');
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
    if (!newTask.trim()) return;
    try {
      const payload = { 
        title: newTask, 
        description: '', 
        status: 'To Do', 
        category, 
        reminder, 
        dueDate
      };
      await API.post('/tasks', payload);
      setNewTask('');
      setCategory('');
      setReminder('');
      setDueDate('');
      fetchTasks();
      toast.success('Task added!');
    } catch (err) {
      toast.error('Error adding task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
      toast.success('Task deleted!');
    } catch (err) {
      toast.error('Error deleting task');
    }
  };

  const markCompleted = async (id) => {
    try {
      await API.put(`/tasks/${id}`, { status: 'Completed' });
      fetchTasks();
      toast.success('Task marked as completed!');
    } catch (err) {
      toast.error('Error marking task as completed');
    }
  };

  const openTaskDetail = (id) => {
    navigate(`/tasks/${id}`);
  };

  return (
    <div className="tasks-container">
      <ToastContainer />
      <h2>My Tasks</h2>
      <div className="form-container">
        <form onSubmit={addTask}>
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="datetime-local"
            placeholder="Set a reminder (optional)"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          />
          <input
            type="date"
            placeholder="Set due date (optional)"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
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
            </div>
            <div className="task-actions">
              <button className="details-btn" onClick={() => openTaskDetail(task._id)}>Details</button>
              <button className="completed-btn" onClick={() => markCompleted(task._id)}>Completed</button>
              <button className="delete-btn" onClick={() => deleteTask(task._id)}>🗑</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
