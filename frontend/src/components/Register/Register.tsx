import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../../styles/Register.css";
import { registerUser } from "../../utilities/api";
import { useAuth } from "../../context/Auth/AuthProvider";
import { Button, Container, Input, Title } from "../../styles/styles";
import styled from "styled-components";
import { useTheme } from '../../context/ThemeContext/ThemeContext';

const RegisterContainer = styled(Container)`
  width: 600px;
  padding: 20px;
  background-color: ${props => props.theme.cardBg};
  color: ${props => props.theme.text};

  @media (max-width: 768px) {
    width: 90%;
    max-width: 400px;
    padding: 15px;
  }
`;

const StyledTitle = styled(Title)`
  font-size: 2em;
  margin-bottom: 20px;
  color: ${props => props.theme.text};

  @media (max-width: 768px) {
    font-size: 1.5em;
    margin-bottom: 15px;
  }
`;

const Description = styled.div`
  color: ${props => props.theme.text};
  font-size: 14px;
  margin-bottom: 0px;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const BulletList = styled.ul`
  margin: 5px 0 0px 20px;
  padding: 0;
  list-style-type: disc;
  color: ${props => props.theme.text};

  @media (max-width: 768px) {
    margin-left: 15px;
    li {
      margin-bottom: 5px;
    }
  }
`;

const HrLine = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${props => props.theme.border};
  margin: 20px 0;

  @media (max-width: 768px) {
    margin: 15px 0;
  }
`;

const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

const Label = styled.label`
  font-size: 14px;
  color: ${props => props.theme.text};
  margin-bottom: 5px;
  display: block;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const StyledInput = styled(Input)`
  width: 100%;
  margin-bottom: 5px;
  padding: 8px 12px;
  font-size: 14px;
  background-color: ${props => props.theme.inputBg};
  color: ${props => props.theme.inputText};
  border: 1px solid ${props => props.theme.inputBorder};

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 16px;
  }
`;

const ErrorText = styled.p`
  color: ${props => props.theme.error};
  font-size: 14px;
  margin: 0 0 10px 0;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-top: 20px;

  @media (max-width: 768px) {
    margin-top: 15px;
    gap: 8px;
  }
`;

const RegisterButton = styled(Button)`
  width: 60%;
  margin: 5px 0;
  font-size: 1em;
  padding: 10px;
  background-color: ${props => props.theme.buttonBg};
  color: ${props => props.theme.buttonText};

  @media (max-width: 768px) {
    width: 100%;
    margin: 4px 0;
    font-size: 0.9em;
    padding: 12px;
  }
`;



const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [finalPassword, setFinalPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Store error messages

  const history = useHistory();
  const { loginUser: authLogin } = useAuth();
  const { isDarkMode } = useTheme();

  // Email validation function
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Password validation function (1 uppercase, 1 number, min 6 characters)
  const isValidPassword = (password: string) => /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

  const handleRegister = async () => {
    let newErrors: { [key: string]: string } = {};

    if (!username.trim()) {
      newErrors.username = "Username cannot be empty.";
    } else if (/\s/.test(username)) {
      newErrors.username = "Username cannot contain spaces.";
    }

    if (!isValidEmail(email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!isValidPassword(checkPassword)) {
      newErrors.password = "Password must have at least 6 characters, one uppercase letter, and one number.";
    }

    if (checkPassword !== finalPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors); // Update errors state

    // If no errors, proceed with registration
    if (Object.keys(newErrors).length === 0) {
      const userData = {
        username: username,
        email: email,
        password: checkPassword,
      };

      const response = await registerUser(userData);
      if (response.status === 200) {
        authLogin(response.user);
        alert("User registered successfully");
        history.push("/");
      } else {
        alert(response.message);
      }
    }
  };

  return (
      <RegisterContainer className="register-container">
        <Title>Register User</Title>
        <Description>
          <BulletList>
            <li>Username is required</li>
            <li>Email must be in a valid format (e.g., user@example.com)</li>
            <li>Password must have at least 6 characters, one uppercase letter, and one number</li>
            <li>Passwords must match</li>
          </BulletList>
        </Description>

        <HrLine></HrLine>

        <Label htmlFor="username">Username</Label>
        {errors.username && <ErrorText>{errors.username}</ErrorText>}
        <StyledInput
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />

        <Label htmlFor="email">Email</Label>
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
        <StyledInput
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <Label htmlFor="password">Password</Label>
        {errors.password && <ErrorText>{errors.password}</ErrorText>}
        <StyledInput
            id="password"
            type="password"
            placeholder="Enter your password"
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
        />

        <Label htmlFor="confirm-password">Confirm Password</Label>
        {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
        <StyledInput
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={finalPassword}
            onChange={(e) => setFinalPassword(e.target.value)}
        />

        <ButtonGroup>
          <RegisterButton className="register-button" onClick={handleRegister}>
            Register
          </RegisterButton>
          <RegisterButton className="register-button" onClick={() => history.push("/login")}>
            Go to Login
          </RegisterButton>
        </ButtonGroup>
      </RegisterContainer>
  );
};

export default Register;
