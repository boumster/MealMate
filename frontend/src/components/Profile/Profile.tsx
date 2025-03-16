import React from "react";
import { useHistory } from "react-router-dom";
import { Container, Button, Paragraph, Label } from "../../styles/styles";
import { useAuth } from "../../context/Auth/AuthProvider";
import styled from "styled-components";

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: black;
  margin-bottom: 15px;
`;

const ProfileCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width:70%;
  justify-content: center;
  gap: 100px;
`;

const ProfileContent = styled.div`
    display: flex;
    flex-direction: column;
    align-content: center;
`;

const Header = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: normal;
`;


const Profile: React.FC = () => {
  const history = useHistory();
  const { isAuthenticated, user, logoutUser } = useAuth(); // Fetch auth state

  return (
    <Container>
        <Header>Hello <b>{user?.username || "User"}</b>, welcome to your personal page!</Header>
      <ProfileCard>
          <ProfileImage src="/images/icons/profileIcon.png" alt="Profile" />
          <ProfileContent>
            <Label><b>Username:</b> {user?.username || "User"}</Label>
            <Label><b>Email:</b> {user?.email || "No Email Available"}</Label>
            <Button onClick={logoutUser}>Logout</Button>
          </ProfileContent>
        </ProfileCard>
    </Container>
  );
};

export default Profile;
