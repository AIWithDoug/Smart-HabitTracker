import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState(null);

  //Handle Logins
  const handleLogin = (email) => {
    setUser(email);
  };

  //Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  //Check initial Auth State
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user?.email || null);
    };

    checkUser();

    //Auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user?.email || null);
      }
    );

    // Cleanup Subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="w-full min-h-screen">
      <Router>
        <Routes>
          <Route path="/" />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
