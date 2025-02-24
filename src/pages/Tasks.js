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
  const [dueDate, setDueDate] = useState('');
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
        dueDate,
        reminder 
      };
      await API.post('/tasks', payload);
      setNewTask('');
      setCategory('');
      setDueDate('');
      setReminder('');
      fetchTasks();
      toast.success('Task added!');
    } catch (err) {
      toast.error('Error adding task');
    }
  };

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
            placeholder="Add a New Task..."
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
            type="text" 
            placeholder="Set Due Date" 
            onFocus={(e) => e.target.type = 'date'} 
            onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <input
            type="text" 
            placeholder="Set a Reminder (optional)" 
            onFocus={(e) => e.target.type = 'date'} 
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
