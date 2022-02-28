import React from 'react';
import './App.css';
import { AuthContext } from './contexts/AuthContext';
import { useAuthListener } from './hooks/use-auth-listener';
import Dashboard from './pages/Dashboard';
import { SignIn } from './pages/SignIn';

function App() {

  const user = useAuthListener()
  console.log(user)

  return (
    <AuthContext.Provider value={user}>
      <div className="App">
          <SignIn/>
          {/* <Dashboard /> */}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
