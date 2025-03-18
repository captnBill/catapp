import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBqaJ2m8E81xuer-l5giLWBYIS5ZbY5ks0",
  authDomain: "catapp-project.firebaseapp.com",
  projectId: "catapp-project",
  storageBucket: "catapp-project.firebasestorage.app",
  messagingSenderId: "637742691770",
  appId: "1:637742691770:web:55eb6c911eca3ae70c5983",
  measurementId: "G-Q6HK0MPV0L",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };