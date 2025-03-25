// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSvUFpxzb1vxt7HtJz5_dzIeHn0hBUgFE",
  authDomain: "servicexchange-9b596.firebaseapp.com",
  projectId: "servicexchange-9b596",
  storageBucket: "servicexchange-9b596.firebasestorage.app",
  messagingSenderId: "954365229542",
  appId: "1:954365229542:web:27fd34246704d61346fe27",
  measurementId: "G-N62RRTYFRW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);