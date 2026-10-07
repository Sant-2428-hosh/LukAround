import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithCredential } from 'firebase/auth';

const isPlaceholder = (val) => !val || typeof val !== 'string' || val.includes('your_') || val.includes('your-') || val.includes('example');

const firebaseConfig = {
  apiKey: !isPlaceholder(import.meta.env.VITE_FIREBASE_API_KEY) ? import.meta.env.VITE_FIREBASE_API_KEY : "AIzaSyCmerz02fhIE_bbAE-CVwYKk3EvGHuyy2Y",
  authDomain: !isPlaceholder(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN : "lukaround-d0d47.firebaseapp.com",
  projectId: !isPlaceholder(import.meta.env.VITE_FIREBASE_PROJECT_ID) ? import.meta.env.VITE_FIREBASE_PROJECT_ID : "lukaround-d0d47",
  storageBucket: !isPlaceholder(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) ? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET : "lukaround-d0d47.firebasestorage.app",
  messagingSenderId: !isPlaceholder(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) ? import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID : "1055485765270",
  appId: !isPlaceholder(import.meta.env.VITE_FIREBASE_APP_ID) ? import.meta.env.VITE_FIREBASE_APP_ID : "1:1055485765270:web:f3075b302cf56becc6c4b7"
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

export { signInWithPopup, signInWithCredential, GoogleAuthProvider };
export default app;
