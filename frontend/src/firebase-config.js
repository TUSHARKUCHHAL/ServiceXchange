import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider, 
    OAuthProvider,  // ✅ Import Apple Provider
    signInWithPopup, 
    RecaptchaVerifier, 
    signInWithPhoneNumber 
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCSvUFpxzb1vxt7HtJz5_dzIeHn0hBUgFE",
    authDomain: "servicexchange-9b596.firebaseapp.com",
    projectId: "servicexchange-9b596",
    storageBucket: "servicexchange-9b596.appspot.com",  // ✅ Fixed typo
    messagingSenderId: "954365229542",
    appId: "1:954365229542:web:27fd34246704d61346fe27",
    measurementId: "G-N62RRTYFRW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com"); // ✅ Apple Auth Provider

export { auth, googleProvider, appleProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber };
