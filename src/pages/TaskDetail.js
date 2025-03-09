import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/TaskDetail.css';
import SidebarMenu from '../components/SidebarMenu';

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true); // <-- Added loading state
    const [editing, setEditing] = useState(false);
    const [updatedTask, setUpdatedTask] = useState({ title: '', category: '', reminder: '', dueDate: '' });

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const { data } = await API.get(`/tasks/${id}`);
                setTask(data);
                setUpdatedTask({
                    title: data.title || '',
                    category: data.category || '',
                    reminder: data.reminder ? data.reminder.substring(0, 16) : '',
                    dueDate: data.dueDate ? data.dueDate.substring(0, 10) : ''
                });
                setLoading(false); // <-- Stop loading
            } catch (err) {
                console.error('Error fetching task:', err);
                toast.error('Error fetching task data.');
                setLoading(false); // <-- Stop loading even if there's an error
            }
        };
        fetchTask();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('No authentication token found. Please log in again.');
                return;
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const payload = {
                title: updatedTask.title,
                category: updatedTask.category,
                reminder: updatedTask.reminder,
                dueDate: updatedTask.dueDate,
                status: task.status
            };

            const { data } = await API.put(`/tasks/${id}`, payload, config);
            setTask(data);
            setEditing(false);
            console.log("Task updated successfully, showing toast...");
            toast.success('Task updated!');
        } catch (err) {
            console.error('Error updating task:', err);
            toast.error('Error saving task changes');
        }
    };

    if (loading) return <div>Loading...</div>; 

    if (!task) return <div>Error loading task. Try again later.</div>; 

    return (
        <div className="task-detail-container">
            <SidebarMenu />
            <ToastContainer /> {/* Toast messages */}

            <h2>Task Details</h2>
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
                        placeholder="Set Due Date"
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                        value={updatedTask.dueDate}
                        onChange={(e) => setUpdatedTask({ ...updatedTask, dueDate: e.target.value })}
                    />
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setEditing(false)}>Cancel</button>
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
