import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../styles/TaskModal.css';


const TaskModal = ({ closeModal, onSave }) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [category, setCategory] = useState('');
    const [reminder, setReminder] = useState('');

    const handleSave = () => {
        if (!taskTitle.trim()) {
            return toast.error('Task title is required');
        }

        if (!dueDate) {
            return toast.error('Due Date is required');
        }

        onSave({ title: taskTitle, dueDate, category, reminder });
        closeModal();
    };

    return (
        <div className="modal-overlay">
            <div className="modal modal-vertical">
                <h3>Add a New Task</h3>
                <input
                    type="text"
                    placeholder="Task Title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
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
                    placeholder="Category (Optional)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Set Reminder (Optional)"
                    onFocus={(e) => e.target.type = 'datetime-local'}
                    onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                />
                <div className="modal-buttons">
                    <button onClick={handleSave}>Save Task</button>
                    <button onClick={closeModal}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
