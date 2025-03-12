import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../../styles/Login.css";
import { loginUser } from "../../utilities/api";
import { useAuth } from "../../context/Auth/AuthProvider";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory(); //for navigating pages
  const { loginUser: authLogin } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const userData = {
        username,
        password,
      };

      const response = await loginUser(userData);
      
      if (response && response.status === 200) {
        // Store user data in auth context
        await authLogin(response.user);
        history.push("/");
      } else {
        setError(response?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    }
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
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
      <button
        className="login-button"
        onClick={() => history.push("/register")}
      >
        Register
      </button>
      <button className="login-button" onClick={() => history.push("/")}>
        Return to Home
      </button>
    </div>
  );
};

export default Login;
