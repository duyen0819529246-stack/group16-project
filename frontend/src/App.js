// src/App.js
import React, { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import HeaderAuth from "./components/HeaderAuth";
import "./App.css";

function App() {
  const [auth, setAuth] = useState({});

  const onLogin = (payload) => {
    setAuth(payload);
  };
  const onLogout = () => {
    setAuth({});
  };

  return (
    <div className="container">
      <header>
        <h1>Authentication Demo (Frontend)</h1>
        <HeaderAuth onLogout={onLogout} />
      </header>

      <main style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 20 }}>
        <Signup />
        <Login onLogin={onLogin} />
      </main>
    </div>
  );
}

export default App;
