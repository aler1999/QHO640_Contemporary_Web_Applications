import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getPerformance } from "firebase/performance";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD089JQCvPeNQl1rHb1ac8d6XJODAIL7RI",
  authDomain: "qho640-9e099.firebaseapp.com",
  projectId: "qho640-9e099",
  storageBucket: "qho640-9e099.appspot.com",
  messagingSenderId: "164048019060",
  appId: "1:164048019060:web:b3473b3200d81852d63b21"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const GoogleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

export const storage = getStorage(app);

export const perf = getPerformance(app);