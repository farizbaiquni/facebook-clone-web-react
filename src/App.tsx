import React, { useEffect, useState } from "react";
import "./App.css";
import { userType } from "./constants/EntityType";
import { AuthContext } from "./contexts/AuthContext";
import { UserContext } from "./contexts/UserContext";
import AddUserProfile from "./pages/AddUserProfile";
import Dashboard from "./pages/Dashboard";
import Loading from "./pages/Loading";
import { SignIn } from "./pages/SignIn";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./helpers/protectedRoute";
import { db } from "./lib/firebase";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export default function App() {
  const auth = getAuth();
  const [authUser, setAuthUser] = useState<User | undefined | null>(undefined);
  const [userSnapshot, setUserSnapshot] = useState<userType | undefined | null>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [firstRoute] = useState<null | String>(null);

  const checkAuthUserExist = (_authUser: User | null | undefined): boolean => {
    if (authUser !== null && authUser !== undefined) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (authUser !== null && authUser !== undefined) {
      const userListener = onSnapshot(doc(db, "users", authUser.uid), (doc) => {
        if (doc.data() !== undefined) {
          setUserSnapshot({
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
        } else {
          setUserSnapshot(null);
        }
        setIsLoading(false);
      });
      return () => userListener();
    }
  }, [auth, authUser]);

  useEffect(() => {
    const listener = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(null);
        setAuthUser(user);
        console.log("object");
      } else {
        setAuthUser(null);
        setUserSnapshot(null);
        setIsLoading(false);
      }
    });

    return () => listener();
  }, [auth]);

  return (
    <div className="App w-full">
      <AuthContext.Provider value={authUser}>
        <UserContext.Provider value={userSnapshot}>
          <Routes>
            <Route
              path="/"
              element={
                isLoading ? (
                  <Loading />
                ) : userSnapshot === null ? (
                  <Navigate to="/signIn" replace />
                ) : (
                  <Navigate to="/home" replace />
                )
              }
            />
            <Route
              path="/signIn"
              element={
                isLoading ? (
                  <Loading />
                ) : checkAuthUserExist(authUser) ? (
                  <Navigate to="/home" />
                ) : (
                  <SignIn />
                )
              }
            />
            <Route path="/addUserProfile" element={<AddUserProfile />} />
            <Route path="/home" element={<Dashboard />} />
          </Routes>
        </UserContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}
