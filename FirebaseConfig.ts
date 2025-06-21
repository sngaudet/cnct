// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3DerALfu6MV40ISpzHllr1o_n7TXk7N8",
  authDomain: "cnct-2886b.firebaseapp.com",
  projectId: "cnct-2886b",
  storageBucket: "cnct-2886b.firebasestorage.app",
  messagingSenderId: "989897573227",
  appId: "1:989897573227:web:4da201d3d66d9e9663422e"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);