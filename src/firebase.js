import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBSveTtJxiqO1_HHRETW9WLuEXG4MdGgew",
    authDomain: "frontend-studies-react.firebaseapp.com",
    projectId: "frontend-studies-react",
    storageBucket: "frontend-studies-react.firebasestorage.app",
    messagingSenderId: "725296507595",
    appId: "1:725296507595:web:501b08467733b29b5b094e",
    measurementId: "G-CHJB8FK3GH"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);