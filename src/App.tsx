import React from 'react';
import './App.css';
import { AuthContext } from './contexts/AuthContext';
import { UserContext } from './contexts/UserContext';
import { useAuthListener } from './hooks/use-auth-listener';
import useUserListener from './hooks/use-user-listener';
import Dashboard from './pages/Dashboard';
import { SignIn } from './pages/SignIn';

function App() {

  const auth = useAuthListener()
  const user = useUserListener()

  return (
    <AuthContext.Provider value={auth}>
      <UserContext.Provider value={user}>
        <div className="App">
            {/* <SignIn/> */}
            <Dashboard />
        </div>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
