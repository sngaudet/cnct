// app/screens/Logout.tsx
import { useEffect } from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";

const Logout = () => {
  useEffect(() => {
    FIREBASE_AUTH.signOut();
  }, []);

  return null; // no UI needed
};

export default Logout;
