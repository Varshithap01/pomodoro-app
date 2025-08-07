import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('');

  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const fetchedTasks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    console.log('Add Task clicked');
    console.log('Title:', newTitle);
    console.log('Description:', newDescription);
    console.log('Date:', newDate);

    if (!newTitle.trim()) {
      alert('Task title cannot be empty!');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        title: newTitle.trim(),
        description: newDescription.trim(),
        dueDate: newDate,
        completed: false,
        createdAt: new Date(),
      });

      console.log('Task added with ID: ', docRef.id);
      fetchTasks(); // Refresh task list from DB
      setNewTitle('');
      setNewDescription('');
      setNewDate('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleTaskCompletion = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'tasks', id), {
        completed: !currentStatus,
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        My Tasks
      </h2>

      <div className="space-y-3 mb-6">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Task Title"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTask}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      <ul className="space-y-4 max-h-[400px] overflow-y-auto">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id, task.completed)}
                  className="h-5 w-5 text-blue-500"
                />
                <h3
                  className={`text-lg font-semibold ${
                    task.completed ? 'line-through text-gray-400' : ''
                  }`}
                >
                  {task.title}
                </h3>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
            {task.description && (
              <p className="text-sm text-gray-600">{task.description}</p>
            )}
            {task.dueDate && (
              <p className="text-sm text-gray-500 mt-1">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskListPage;
