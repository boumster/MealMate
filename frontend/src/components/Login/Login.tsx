import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../../styles/Login.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory(); //for navigating pages

  const handleLogin = () => {
    console.log("Login button clicked (not implemented yet)");
  };

  return (
    <div className="login-container">
      <h2>Mealmate Login</h2>
      <input
        type="text"
        placeholder="Username"
        className="login-input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-button" onClick={handleLogin}>Login</button>
      <button className="login-button" onClick={() => history.push("/register")}>Register</button>
      <button className="login-button" onClick={() => history.push("/")}>Return to Home</button>
    </div>
  );
};

export default Login;
