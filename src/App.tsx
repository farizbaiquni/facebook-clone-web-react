import { Sign } from "crypto";
import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { userType } from "./constants/EntityType";
import { AuthContext } from "./contexts/AuthContext";
import { UserContext } from "./contexts/UserContext";
import { useAuthListener } from "./hooks/use-auth-listener";
import useUserListener from "./hooks/use-user-listener";
import AddUserProfile from "./pages/AddUserProfile";
import Dashboard from "./pages/Dashboard";
import Loading from "./pages/Loading";
import { SignIn } from "./pages/SignIn";

function App() {
  let auth = useAuthListener();
  let user = useUserListener(auth);
  const [firstRoute, setFirstRoute] = useState<
    null | "signIn" | "dashboard" | "addUserProfile"
  >(null);

  const handleFirstRoute = useCallback((auth, user) => {
    if (auth !== undefined) {
      if (auth === null) {
        setFirstRoute("signIn");
      } else {
        if (user !== undefined) {
          if (user === null) {
            setFirstRoute("addUserProfile");
          } else {
            const tempResult = checkUserData(user);
            if (tempResult) {
              setFirstRoute("dashboard");
            } else {
              setFirstRoute("addUserProfile");
            }
          }
        }
      }
    }

    function checkUserData(user: userType) {
      switch (true) {
        case user.firstName == null:
          return false;
        case user.lastName == null:
          return false;
        case user.gender == null:
          return false;
        case user.birthDate == null:
          return false;
        default:
          return true;
      }
    }
  }, []);

  useEffect(() => {
    handleFirstRoute(auth, user);
  }, [auth, user]);

  return (
    <AuthContext.Provider value={auth}>
      <UserContext.Provider value={user}>
        <div className="App w-full">
          {(() => {
            switch (firstRoute) {
              case null:
                return <Loading />;
              case "signIn":
                return <SignIn />;
              case "addUserProfile":
                return <AddUserProfile />;
              case "dashboard":
                return <Dashboard />;
            }
          })()}
        </div>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
