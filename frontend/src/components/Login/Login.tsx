import React, { useState } from "react";
import "../../styles/Login.css";

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Authentication logic is commented out for now, i think alyan will be working on this to go against the database
    /*
    if (username === "admin" && password === "password") {
      localStorage.setItem("isAuthenticated", "true"); 
      onLogin();
    } else {
      alert("Invalid credentials! Try 'admin' and 'password'.");
    }
    */
    console.log("Login button clicked (not implemented yet)");
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
