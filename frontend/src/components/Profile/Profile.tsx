import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container, Button, Label, Input } from "../../styles/styles";
import { useAuth } from "../../context/Auth/AuthProvider";
import styled from "styled-components";
import { updateEmail, updatePassword } from "../../utilities/api";
import { useTheme } from "../ThemeContext/ThemeContext";

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid black;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
  }
`;

const ProfileCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  background: ${props => props.theme.cardBg};
  border-radius: 10px;
  box-shadow: ${props => props.theme.shadow};
  width: 70%;
  justify-content: center;
  gap: 100px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 90%;
    gap: 20px;
    padding: 15px;
  }
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;

  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
    text-align: center;
  }
`;

const Header = styled.h1`
  color: ${props => props.theme.text};
  text-align: center;
  margin-bottom: 1rem;
  font-weight: normal;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    padding: 0 10px;
  }
`;

const EditContainer = styled.div`
  width: 70%;
  background: ${props => props.theme.cardBg};
  padding: 20px;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: ${props => props.theme.shadow};
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 768px) {
    width: 90%;
    padding: 15px;
    margin-top: 15px;
    gap: 10px;
  }
`;

const PasswordContainer = styled(EditContainer)`
  border: 1px solid ${props => props.theme.border};
  margin-top: 30px;

  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const EditInput = styled(Input)`
  width: 100%;
  padding: 10px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 5px;
  font-size: 1rem;
  background-color: ${props => props.theme.cardBg};
  color: ${props => props.theme.text};

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 8px;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const SuccessText = styled.p`
  color: green;
  font-size: 14px;
  margin-top: 5px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;


const StyledContainer = styled(Container)`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  min-height: 100vh;
  position: relative;
`;

const Profile: React.FC = () => {
  const history = useHistory();
  const { isAuthenticated, user, logoutUser, setUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password: string) => /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

  const handleEmailUpdate = async () => {
    let newErrors: { [key: string]: string } = {};

    if (!isValidEmail(email)) {
      newErrors.email = "Invalid email format.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMessage("");
      return;
    }

    const response = await updateEmail(user?.username, email);

    if (response.status === 200) {
      setSuccessMessage(response.message);
      setErrors({});

      if (user && setUser) {
        setUser({ ...user, email });
      }

      setTimeout(() => {
        history.push("/profile");
        setSuccessMessage("");
      }, 2000);
    } else {
      setErrors({ email: response.message });
      setSuccessMessage("");
    }
  };

  const handlePasswordUpdate = async () => {
    let newErrors: { [key: string]: string } = {};

    if (!isValidPassword(newPassword)) {
      newErrors.password = "Password must have at least 6 characters, one uppercase letter, and one number.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMessage("");
      return;
    }

    const response = await updatePassword(user?.username, currentPassword, newPassword);

    if (response.status === 200) {
      setSuccessMessage(response.message + ", Logging out...");
      setErrors({});
      setTimeout(() => {
        logoutUser();
        history.push("/login");
      }, 2000);
    } else if (response.status === 400) {
      setErrors({ password: response.message });
      setSuccessMessage("");
    } else {
      setErrors({ general: response.message || "An unexpected error occurred." });
      setSuccessMessage("");
    }
  };

  return (
      <StyledContainer>

        <Header>Hello <b>{user?.username || "User"}</b>, welcome to your personal page!</Header>

        <ProfileCard>
          <ProfileImage src="/images/icons/profileIcon.png" alt="Profile" />
          <ProfileContent>
            <Label><b>Username:</b> {user?.username || "User"}</Label>
            <Label><b>Email:</b> {user?.email || "No Email Available"}</Label>
            <Button onClick={logoutUser}>Logout</Button>
          </ProfileContent>
        </ProfileCard>

        <EditContainer>
          <Label><b>Current Email:</b></Label>
          <EditInput type="text" value={user?.email || "User"} disabled />

          <Label><b>Change Email:</b></Label>
          <EditInput
              type="email"
              placeholder="Enter new email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
          {successMessage && <SuccessText>{successMessage}</SuccessText>}

          <Button onClick={handleEmailUpdate}>Save Changes</Button>
        </EditContainer>

        <PasswordContainer>
          <Label><b>Change Password</b></Label>

          <Label>Current Password:</Label>
          <EditInput
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <Label>New Password:</Label>
          <EditInput
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}
          {successMessage && <SuccessText>{successMessage}</SuccessText>}

          <Button onClick={handlePasswordUpdate}>Change Password</Button>
        </PasswordContainer>
      </StyledContainer>
  );
};

export default Profile;