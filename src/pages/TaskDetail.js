import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/TaskDetail.css';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({ title: '', category: '', reminder: '', dueDate: '' });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await API.get(`/tasks/${id}`);
        setTask(data);
        setUpdatedTask({
          title: data.title,
          category: data.category || '',
          reminder: data.reminder ? data.reminder.substring(0, 16) : '',
          dueDate: data.dueDate ? data.dueDate.substring(0, 10) : ''
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchTask();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/tasks/${id}`, updatedTask);
      setEditing(false);
      const refreshed = await API.get(`/tasks/${id}`);
      setTask(refreshed.data);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div className="task-detail-container">
      <h2>Task Detail</h2>
      {editing ? (
        <form onSubmit={handleUpdate} className="form-container">
          <label>Title:</label>
          <input
            type="text"
            value={updatedTask.title}
            onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
            required
          />
          <label>Category:</label>
          <input
            type="text"
            placeholder="Category"
            value={updatedTask.category}
            onChange={(e) => setUpdatedTask({ ...updatedTask, category: e.target.value })}
          />
          <label>Reminder:</label>
          <input
            type="text"
            placeholder="Set Reminder"
            onFocus={(e) => e.target.type = 'datetime-local'}
            onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} 
            value={updatedTask.reminder}
            onChange={(e) => setUpdatedTask({ ...updatedTask, reminder: e.target.value })}
          />
          <label>Due Date:</label>
          <input
            type="text"
            placeholder="Set Reminder"
            onFocus={(e) => e.target.type = 'datetime-local'}
            onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} 
            value={updatedTask.dueDate}
            onChange={(e) => setUpdatedTask({ ...updatedTask, dueDate: e.target.value })}
          />
          <button type="submit">Save Changes</button>
          <button type="back-button">Cancel</button>
        </form>
      ) : (
        <div className="task-details">
          <p><strong>Title:</strong> {task.title}</p>
          <p><strong>Category:</strong> {task.category || 'None'}</p>
          <p><strong>Reminder:</strong> {task.reminder ? new Date(task.reminder).toLocaleString() : 'Not set'}</p>
          <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</p>
          <p><strong>Status:</strong> {task.status}</p>
          <button onClick={() => setEditing(true)}>Edit Task</button>
          <button onClick={() => navigate(-1)}>Back</button>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
