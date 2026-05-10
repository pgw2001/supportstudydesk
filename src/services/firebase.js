import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    "AIzaSyBBKBTYzV0gJLTuMm3mOQIWPRvMcdqsP-8",

  authDomain:
    "supportstudydesk-6506b.firebaseapp.com",

  projectId:
    "supportstudydesk-6506b",

  storageBucket:
    "supportstudydesk-6506b.firebasestorage.app",

  messagingSenderId:
    "575460134343",

  appId:
    "1:575460134343:web:a4f3957f62c1440f01dde2",

  measurementId:
    "G-PZJNY0SJ52",
};

const app =
  initializeApp(firebaseConfig);

export const auth =
  getAuth(app);

export const db =
  getFirestore(app);

export default app;