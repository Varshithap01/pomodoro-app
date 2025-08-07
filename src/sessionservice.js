// sessionService.js
import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const saveWorkSession = async (taskName, duration, completed) => {
  try {
    const docRef = await addDoc(collection(db, "pomodoroSessions"), {
      taskName,
      duration,
      completed,
      date: Timestamp.now()
    });
    console.log("Session saved with ID: ", docRef.id);
  } catch (e) {
    console.error("Error saving session: ", e);
  }
};
