// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVj8DVVyPJzuHE32gDBCaWPzJ1ewM2bxQ",
  authDomain: "vomeo-9735f.firebaseapp.com",
  projectId: "vomeo-9735f",
  storageBucket: "vomeo-9735f.firebasestorage.app",
  messagingSenderId: "188517037106",
  appId: "1:188517037106:web:7be4aa4dfc1aca6269f82b",
  measurementId: "G-8YRPJ75N81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app; 