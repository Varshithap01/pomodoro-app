// src/services/saveWorkSession.js
import { db } from './firebase'; // ✅ Correct relative path to firebase
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const saveWorkSession = async (sessionType, duration) => {
  try {
    await addDoc(collection(db, 'pomodoroSessions'), {
      sessionType,
      duration,
      date: Timestamp.now(), // 🔐 Use Firestore's server timestamp
    });
    console.log('✅ Session saved successfully:', sessionType, duration);
  } catch (error) {
    console.error('❌ Error saving session:', error.message || error);
  }
};
