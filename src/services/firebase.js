import { initializeApp } from "firebase/app";

import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";

const serviceKey = import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey:
    serviceKey,

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

setPersistence(
  auth,
  browserLocalPersistence
);

export const db =
  getFirestore(app);

export default app;