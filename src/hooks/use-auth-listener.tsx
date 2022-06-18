import { useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FirebaseContext } from "../contexts/FirebaseContext";

export const useAuthListener = () => {
  const firebase = useContext(FirebaseContext);
  const auth = getAuth();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("aa") || "{}")
  );

  useEffect(() => {
    const listener = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("userCredentialFbClone", JSON.stringify(user));
        setUser(user);
      } else {
        localStorage.removeItem("userCredentialFbClone");
        setUser(null);
      }
    });

    return () => listener();
  }, [auth, firebase]);

  return user;
};
