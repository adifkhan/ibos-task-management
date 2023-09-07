// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJq5dT7BvjKQLzXEr5QJf8zPrwvM5ZXXc",
  authDomain: "ibos-task-management-7f5c9.firebaseapp.com",
  projectId: "ibos-task-management-7f5c9",
  storageBucket: "ibos-task-management-7f5c9.appspot.com",
  messagingSenderId: "758206079686",
  appId: "1:758206079686:web:2ce44b9e1d47221cc9adc7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export default auth;
