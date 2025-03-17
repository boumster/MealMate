import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Button, Label, Input } from "../../styles/styles";
import { useAuth } from "../../context/Auth/AuthProvider";
import styled from "styled-components";

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid black;
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
  width: 70%;
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

// Editable Info Container
const EditContainer = styled.div`
  width: 70%;
  background: white;
  padding: 20px;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PasswordContainer = styled(EditContainer)`
  border: 1px solid #ccc;
  margin-top: 30px;
`;

const EditInput = styled(Input)`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  background-color: white;
`;

const inputContainer = styled.div`

`;

const Profile: React.FC = () => {
  const history = useHistory();
  const { isAuthenticated, user, logoutUser } = useAuth(); // Fetch auth state

  // Editable state
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <Container>
      <Header>Hello <b>{user?.username || "User"}</b>, welcome to your personal page!</Header>
      
      {/* Profile Card */}
      <ProfileCard>
        <ProfileImage src="/images/icons/profileIcon.png" alt="Profile" />
        <ProfileContent>
          <Label><b>Username:</b> {user?.username || "User"}</Label>
          <Label><b>Email:</b> {user?.email || "No Email Available"}</Label>
          <Button onClick={logoutUser}>Logout</Button>
        </ProfileContent>
      </ProfileCard>

      {/* Edit Personal Info */}
      <EditContainer>
        <Label><b>Username:</b></Label>
        <EditInput type="text" value={user?.username || "User"} disabled />

        <Label><b>Current Email:</b></Label>
        <EditInput 
          type="text" 
          value={user?.email || "User"} disabled          
          onChange={(e) => setEmail(e.target.value)} 
        />

        <Label><b>Change Email:</b></Label>
        <EditInput 
          type="email" 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter new email"
        />

        <Button>Save Changes</Button>
      </EditContainer>

      {/* Change Password Section */}
      <PasswordContainer>
        <Label><b>Change Password</b></Label>

        <Label>Current Password:</Label>
        <EditInput 
          type="password" 
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)} 
          placeholder="Enter current password"
        />

        <Label>New Password:</Label>
        <EditInput 
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          placeholder="Enter new password"
        />

        <Button>Change Password</Button>
      </PasswordContainer>
    </Container>
  );
};

export default Profile;
