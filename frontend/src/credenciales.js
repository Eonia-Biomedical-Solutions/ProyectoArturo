// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJObnoHQFpI86YcLgBGhTQ6fXHC1eCaS4",
  authDomain: "bookstoreonline-4d392.firebaseapp.com",
  projectId: "bookstoreonline-4d392",
  storageBucket: "bookstoreonline-4d392.appspot.com",
  messagingSenderId: "950698654579",
  appId: "1:950698654579:web:5fd897b35fdff6c63fa306"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;