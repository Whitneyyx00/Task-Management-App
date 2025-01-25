import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/tasks');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });
            const data = await response.json();
            setTasks([...tasks, data]);
            setNewTask({ title: '', description: '' });
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };
    
    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:3001/api/tasks/${id}`, {
                method: 'DELETE',
            });
            setTasks(tasks.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3001/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const updatedTask = await response.json();
            setTasks(tasks.map(task =>
                task.id === id ? updatedTask : task
            ));
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div className='app'>
            <header>
                <h1>Task Management System</h1>
            </header>

            <form onSubmit={handleSubmit} className='task-form'>
                <input
                    type='text'
                    placeholder='Task Title'
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                />
                <textarea
                    placeholder='Task Description'
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    required
                />
                <button type='submit'>Add Task</button>
            </form>

            {isLoading ? (
                <div className='loading'>Loading tasks...</div>
            ) : (
                <div className='tasks-grid'>
                    {tasks.map(task => (
                        <div key={task.id} className={`task-card ${task.status}`}>
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <div className='task-actions'>
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                >
                                    <option value='pending'>Pending</option>
                                    <option value='in-progress'>In Progress</option>
                                    <option value='completed'>Completed</option>
                                </select>
                                <button onClick={() => handleDelete(task.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;