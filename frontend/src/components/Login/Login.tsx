import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../../styles/Login.css";
import { loginUser } from "../../utilities/api";
import { useAuth } from "../../context/Auth/AuthProvider";
import { Button, Container, Input } from "../../styles/styles";
import Loading from "../Loading/Loading";
import styled from "styled-components";

const LoginContainer = styled(Container)`
  width: 400px;
  padding: 20px;

  @media (max-width: 768px) {
    width: 90%;
    max-width: 350px;
    padding: 15px;
  }
`;

const Title = styled.h2`
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.5em;
    margin-bottom: 15px;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin: 10px 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const StyledInput = styled(Input)`
  width: 100%;
  margin-bottom: 15px;
  padding: 8px 12px;
  font-size: 14px;

  @media (max-width: 768px) {
    margin-bottom: 12px;
    padding: 10px;
    font-size: 16px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const LoginButton = styled(Button)`
  width: 60%;
  margin: 5px 0;
  font-size: 1em;
  padding: 10px;

  @media (max-width: 768px) {
    width: 100%;
    margin: 4px 0;
    font-size: 0.9em;
    padding: 12px;
  }
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const { loginUser: authLogin } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userData = {
        username,
        password,
      };
      setError("");

      const response = await loginUser(userData);

      if (response && response.status === 200) {
        await authLogin(response.user);
        history.push("/");
      } else {
        setError(
            response?.message ||
            "Login failed invalid credentials. Please Try Again."
        );
      }
    } catch (error) {}
    setLoading(false);
  };

  return (
      <LoginContainer>
        <Title>Mealmate Login</Title>
        {error && <ErrorText>{error}</ErrorText>}
        <StyledInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
        />
        <StyledInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        {loading ? (
            <Loading />
        ) : (
            <ButtonGroup>
              <LoginButton onClick={handleLogin}>
                Login
              </LoginButton>
              <LoginButton onClick={() => history.push("/register")}>
                Register
              </LoginButton>
              <LoginButton onClick={() => history.push("/")}>
                Return to Home
              </LoginButton>
            </ButtonGroup>
        )}
      </LoginContainer>
  );
};

export default Login;