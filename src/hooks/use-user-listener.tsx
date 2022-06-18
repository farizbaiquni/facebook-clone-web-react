import { useContext, useEffect, useState } from "react";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import firebase, { db } from "../lib/firebase";
import type { userType } from "../constants/EntityType";
import { AuthContext } from "../contexts/AuthContext";

function useUserListener(auth: any) {
  const [user, setUser] = useState<userType | null | undefined>(undefined);
  useEffect(() => {
    if (auth != null) {
      if (auth.uid != null) {
        const idUser = auth.uid;
        const userListener = onSnapshot(doc(db, "users", idUser), (doc) => {
          if (doc.data() !== undefined) {
            setUser({
              idUser: doc.data()?.idUser,
              firstName: doc.data()?.firstName,
              lastName: doc.data()?.lastName,
              email: doc.data()?.email,
              birthDate: doc.data()?.birthDate,
              photoProfile: doc.data()?.photoProfile,
              gender: doc.data()?.gender,
              createAt: doc.data()?.createAt,
              friends: doc.data()?.friends,
            });
          }
        });
        return () => userListener();
      }
    }
  }, [auth]);

  return user;
}

export default useUserListener;
