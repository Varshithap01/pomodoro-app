// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config from the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyBoBVPD32FtKfUCNsPw8naiOgQ9gj9b1n4",
  authDomain: "taskmanagerapp-55afe.firebaseapp.com",
  projectId: "taskmanagerapp-55afe",
  storageBucket: "taskmanagerapp-55afe.firebasestorage.app",
  messagingSenderId: "468813451203",
  appId: "1:468813451203:web:22930c93de7978f8e5b776"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Firestore database
export const db = getFirestore(app);
