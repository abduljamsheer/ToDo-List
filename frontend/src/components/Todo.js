
import React, { useEffect, useState } from 'react';
import '../styles/TodoApp.css';
import { FaCalendarAlt, FaCheckCircle, FaTrash, FaEdit } from 'react-icons/fa';
import TodoNavBar from './Navbar';
import { getToken } from '../AuthOparation';
import { useNavigate } from 'react-router-dom';

const TodoApp = () => {
    const [tasks, setTasks] = useState([]);
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTask, setEditedTask] = useState({
        title: '',
        description: ''
    });
    const navigate = useNavigate();
    const URL = 'http://localhost:8001';

    const [taskInput, setTaskInput] = useState({
        title: '',
        description: '',
        priority: '',
        category: '',
        dueDate: ''
    });

    const today = new Date();
    const formattedToday = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });

    useEffect(() => {
        const token = getToken('token');
        if (!token) {
            alert('User not logged in');
            navigate('/');
            return;
        }

        const fetchTasks = async () => {
            try {
                const res = await fetch(`${URL}/api/v1/todos`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Failed to fetch');
                }

                setTasks(data.tasks || []);
            } catch (error) {
                console.log('Failed to fetch tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskInput((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleConfirm = async (e) => {
        e.preventDefault();
        if (!taskInput.title.trim()) return;

        const newTask = {
            ...taskInput,
            completed: false,
        };

        const token = getToken('token');
        if (!token) {
            alert('You need to login first.');
            return;
        }

        try {
            const response = await fetch(`${URL}/api/v1/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTask),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create task');
            }
            setTasks(prev => [...prev, data.tasks]);
            setTaskInput({
                title: '',
                description: '',
                priority: '',
                category: '',
                dueDate: ''
            });
        } catch (error) {
            alert(`Error creating task: ${error.message}`);
            if (error.message === 'Invalid token') {
                navigate('/');
            }
        }
    };

    const HandleDisc = (id) => {
        setExpandedTaskId(prevId => (prevId === id ? null : id));
    };
    const toggleComplete = async (id) => {
        const token = getToken('token');
        if (!token) {
            alert('You need to login first.');
            navigate('/');
            return;
        }

        const taskToUpdate = tasks.find(task => (task.id || task._id) === id);
        if (!taskToUpdate) return;

        const updatedCompletedStatus = !taskToUpdate.completed;

        try {
            const response = await fetch(`${URL}/api/v1/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completed: updatedCompletedStatus }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update task');
            }

            setTasks((prev) =>
                prev.map((task) =>
                    (task.id || task._id) === id
                        ? { ...task, completed: updatedCompletedStatus }
                        : task
                )
            );
        } catch (error) {
            alert(`Error updating task: ${error.message}`);
        }
    };
    const editTask = (task) => {
        setEditingTaskId(task._id || task.id);
        setEditedTask({
            title: task.title,
            description: task.description || ''
        });
    };
    const saveTask = async (id) => {
        const token = getToken('token');
        if (!token) {
            alert('You need to login first.');
            navigate('/');
            return;
        }

        try {
            const response = await fetch(`${URL}/api/v1/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editedTask),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update task');
            }

            setTasks((prev) =>
                prev.map((task) =>
                    (task.id || task._id) === id ? { ...task, ...editedTask } : task
                )
            );

            setEditingTaskId(null);
            setEditedTask({ title: '', description: '' });
        } catch (error) {
            alert(`Error saving task: ${error.message}`);
        }
    };

    const cancelEdit = () => {
        setEditingTaskId(null);
        setEditedTask({ title: '', description: '' });
    };
    const deleteTask = async (id) => {
        alert('Are you sure you want to delete this task?')
        const token = getToken('token');
        if (!token) {
            alert('You need to login first.');
            navigate('/');
            return;
        }
        try {
            const response = await fetch(`${URL}/api/v1/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete task');
            }
            setTasks((prev) => prev.filter((task) => (task.id || task._id) !== id));
        } catch (error) {
            alert(`Error deleting task: ${error.message}`)
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (!task) return false;
        if (activeTab === 'Completed') return task.completed;
        if (activeTab === 'Incomplete') return !task.completed;
        return true;
    });

    return (
        <>
            <TodoNavBar />
            <div className="todo-container">
                <header className="todo-header">
                    <div className="todo-date">
                        <FaCalendarAlt />
                        <span>{formattedToday}</span>
                    </div>
                </header>

                <form className="todo-form" onSubmit={handleConfirm}>
                    <div className="form-group">
                        <label>TITLE</label>
                        <input
                            name="title"
                            value={taskInput.title}
                            onChange={handleChange}
                            placeholder="Hi! What's the Task?"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>DESCRIPTION</label>
                        <input
                            name="description"
                            value={taskInput.description}
                            onChange={handleChange}
                            placeholder="Hi! What's the Description?"
                        />
                    </div>
                    <div className="form-group">
                        <label>PRIORITY</label>
                        <select name="priority" className='options' value={taskInput.priority} onChange={handleChange}>
                            <option value="">Select Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>CATEGORY</label>
                        <select name="category" className='options' value={taskInput.category} onChange={handleChange}>
                            <option value="">Select Category</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Study">Study</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className='date'>DUE DATE</label>
                        <input
                            className='options date'
                            type="date"
                            name="dueDate"
                            value={taskInput.dueDate}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="submit-btn">
                        <FaCheckCircle color='white' />
                    </button>
                </form>

                <div className="tabs">
                    {['All', 'Incomplete', 'Completed'].map(tab => (
                        <span
                            key={tab}
                            className={`tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </span>
                    ))}
                </div>

                <div className="todo-footer">
                    <span>Total Task {filteredTasks.length}</span>
                </div>

                <div className="todo-list">
                    {filteredTasks.map((task, index) => {
                        if (!task || typeof task !== 'object') return null;
                        const taskId = task.id || task._id;
                        const isEditing = editingTaskId === taskId;

                        return (
                            <div key={taskId || index} className="todo-item" onClick={() => HandleDisc(taskId)}>
                                <div className="todo-left">
                                    <input
                                        type="checkbox"
                                        checked={task.completed || false}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() => toggleComplete(taskId)}
                                    />
                                    <div>
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="text"
                                                    className="edit-input"
                                                    value={editedTask.title}
                                                    onChange={(e) =>
                                                        setEditedTask((prev) => ({ ...prev, title: e.target.value }))
                                                    }
                                                />
                                                <textarea
                                                    className="edit-textarea"
                                                    value={editedTask.description}
                                                    onChange={(e) =>
                                                        setEditedTask((prev) => ({ ...prev, description: e.target.value }))
                                                    }
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <p className="todo-title">{task.title || 'Untitled'}</p>
                                                {expandedTaskId === taskId && <p>{task.description}</p>}
                                            </>
                                        )}
                                        <p className="todo-date">
                                            <FaCalendarAlt /> {task.dueDate || 'No due date'}
                                        </p>
                                    </div>
                                </div>
                                <div className="todo-badges">
                                    {task.priority && (
                                        <span className={`badge ${task.priority.toLowerCase()}`}>
                                            {task.priority}
                                        </span>
                                    )}
                                    {task.category && (
                                        <span className={`badge ${task.category.toLowerCase()}`}>
                                            {task.category}
                                        </span>
                                    )}
                                </div>
                                <div className="todo-actions">
                                    {isEditing ? (
                                        <>
                                            <button onClick={(e) => { e.stopPropagation(); saveTask(taskId); }}>
                                                Save
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); cancelEdit(); }}>
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <FaEdit
                                                style={{ opacity: 0.5, cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    editTask(task);
                                                }}
                                            />
                                            <FaTrash
                                                style={{ cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteTask(taskId);
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <footer className="footer">
                <p>&copy; 2025 To-Do Manager. All rights reserved.</p>
            </footer>
        </>
    );
};

export default TodoApp;
