// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCVj8DVVyPJzuHE32gDBCaWPzJ1ewM2bxQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vomeo-9735f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vomeo-9735f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vomeo-9735f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "188517037106",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:188517037106:web:7be4aa4dfc1aca6269f82b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8YRPJ75N81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app; 