import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../../styles/Register.css";
import { registerUser } from "../../utilities/api";
import { Button, Container, Input } from "../../styles/styles";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [finalPassword, setFinalPassword] = useState("");
  const history = useHistory();

  const handleRegister = async () => {
    const userData = {
      username: username,
      email: email,
      password: checkPassword,
    };

    if (checkPassword !== finalPassword) {
      alert("Passwords do not match");
      return;
    }

    const response = await registerUser(userData);
    if (response.status === 201) {
      alert("User registered successfully");
      history.push("/");
    } else {
      alert("User registration failed");
    }
  };

  return (
    <Container className="register-container">
      <h2>Register</h2>
      <Input
        className="register-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        className="register-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        className="register-input"
        id="input-pw"
        type="password"
        placeholder="Password"
        value={checkPassword}
        onChange={(e) => setCheckPassword(e.target.value)}
      />
      <Input
        className="register-input"
        id="confirm-pw"
        type="password"
        placeholder="Confirm password"
        value={finalPassword}
        onChange={(e) => setFinalPassword(e.target.value)}
      />
      {/* maybe 2fa here, or something in login, fix button decisions maybe want register to straight go to login or send confirmation alert. */}
      <Button className="register-button" onClick={handleRegister}>Register</Button>
      {/* make so button checks that checkPassword is equal to finalPassword, if not redo */}
      <Button className="register-button" onClick={() => history.push("/login")}>Go to Login</Button>
    </Container>
  );
};

export default Register;
