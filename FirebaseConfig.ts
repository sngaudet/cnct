// FirebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Add this line

const firebaseConfig = {
  apiKey: "AIzaSyA3DerALfu6MV40ISpzHllr1o_n7TXk7N8",
  authDomain: "cnct-2886b.firebaseapp.com",
  projectId: "cnct-2886b",
  storageBucket: "cnct-2886b.appspot.com", // ✅ This must end in `.appspot.com`
  messagingSenderId: "989897573227",
  appId: "1:989897573227:web:4da201d3d66d9e9663422e",
};

// ✅ Initialize only ONCE
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP); // ✅ Corrected
