import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCmerz02fhIE_bbAE-CVwYKk3EvGHuyy2Y",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lukaround-d0d47.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lukaround-d0d47",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lukaround-d0d47.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1055485765270",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1055485765270:web:f3075b302cf56becc6c4b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { signInWithPopup };
export default app;
