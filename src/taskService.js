// src/services/taskService.js

import { db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc
} from 'firebase/firestore';
export const tasksCollectionRef = collection(db, 'tasks');
// Add a new task
export const addTask = async (taskData) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...taskData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

// Update task (e.g., toggle completion)
export const updateTask = async (taskId, updatedFields) => {
  try {
    await updateDoc(doc(db, 'tasks', taskId), updatedFields);
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete task
export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Get all tasks
export const getAllTasks = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'tasks'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};
