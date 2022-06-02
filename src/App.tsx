import React, { useState } from 'react';
import './App.css';
import { userType } from './constants/EntityType';
import { AuthContext } from './contexts/AuthContext';
import { UserContext } from './contexts/UserContext';
import { useAuthListener } from './hooks/use-auth-listener';
import useUserListener from './hooks/use-user-listener';
import AddUserProfile from './pages/AddUserProfile';
import Dashboard from './pages/Dashboard';
import { SignIn } from './pages/SignIn';

function App() {

  let auth = useAuthListener()
  let user = useUserListener()

  const checkUserData = (user: userType) => {
    switch (true) {
      case user.firstName != null:
        return false
      case user.lastName != null:
        return false
      case user.gender != null:
        return false
      case user.birthDate != null:
        return false
      default:
        return true
    }
  }

  return (
    <AuthContext.Provider value={auth}>
      <UserContext.Provider value={user}>
        <div className="App">
          {
            (auth != null) ? ( 
              (user != null && checkUserData(user)) ? <Dashboard /> : <AddUserProfile />
            ) : (
            <SignIn />
            )
          }
        </div>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
