// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0bNQ2VF-nD0r8sIpHfnYi6KyuPFHfkEw",
  authDomain: "taproomtracker.firebaseapp.com",
  projectId: "taproomtracker",
  storageBucket: "taproomtracker.firebasestorage.app",
  messagingSenderId: "875052756222",
  appId: "1:875052756222:web:25724179ec1926a2a789af",
  measurementId: "G-0SNTRRHXPL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);export const db = getFirestore(app);
