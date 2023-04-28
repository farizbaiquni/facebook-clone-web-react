import React, { ReactNode, useEffect, useState } from "react";
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

function App() {
  const auth = getAuth();
  const [authUser, setAuthUser] = useState<User | undefined | null>(undefined);
  const [userSnapshot, setUserSnapshot] = useState<userType | undefined | null>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [firstRoute] = useState<null | String>(null);

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
        setAuthUser(user);
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
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/addUserProfile" element={<AddUserProfile />} />
            <Route
              path="/home"
              element={
                <ProtectedRoute route={firstRoute}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </UserContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
