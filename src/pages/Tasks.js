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
        reminder 
      };
      await API.post('/tasks', payload);
      setNewTask('');
      setCategory('');
      setReminder('');
      fetchTasks();
      toast.success('Task added!');
    } catch (err) {
      toast.error('Error adding task');
    }
  };

  // Remove immediate completion toggle and use navigation to detail view
  const openTaskDetail = (id) => {
    navigate(`/tasks/${id}`);
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
          <button type="submit">Add Task</button>
        </form>
      </div>
      <ul className="tasks-list">
        {tasks.map((task) => (
          <li key={task._id} className={task.status === 'Completed' ? 'completed' : ''}>
            <div className="task-info" onClick={() => openTaskDetail(task._id)}>
              {task.title}
              {task.category && <span className="task-category"> [{task.category}]</span>}
              {task.reminder && <span className="task-reminder"> (Reminder: {new Date(task.reminder).toLocaleString()})</span>}
              {task.dueDate && <span className="task-dueDate"> (Due: {new Date(task.dueDate).toLocaleDateString()})</span>}
            </div>
            <button className="delete-btn" onClick={() => deleteTask(task._id)}>🗑</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
