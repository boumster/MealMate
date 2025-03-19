import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Container, Button, Label, Input } from "../../styles/styles";
import { useAuth } from "../../context/Auth/AuthProvider";
import styled from "styled-components";
import { updateEmail, updatePassword } from "../../utilities/api"; 

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

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

const SuccessText = styled.p`
  color: green;
  font-size: 14px;
  margin-top: 5px;
`;

const Profile: React.FC = () => {
  const history = useHistory();
  const { isAuthenticated, user, logoutUser } = useAuth();

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  // Email validation
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Password validation (6+ chars, 1 uppercase, 1 number)
  const isValidPassword = (password: string) => /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

  // 🔹 Handle Email Update
  const handleEmailUpdate = async () => {
    let newErrors: { [key: string]: string } = {};
  
    if (!isValidEmail(email)) {
      newErrors.email = "Invalid email format.";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMessage(""); // Clear success message on error
      return;
    }
  
    const response = await updateEmail(user?.username, email);
    
    if (response.status === 200) {
      setSuccessMessage(response.message); // ✅ Show actual success message from backend
      setErrors({}); // Clear errors on success
      
    } else {
      setErrors({ email: response.message });
      setSuccessMessage(""); // Clear success message on error
    }

  };
  
  // 🔹 Handle Password Update
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
      setTimeout(() => { // Added 2s timeout to show success.
        logoutUser();
        history.push("/login");
      }, 2000);
    } 
    else if (response.status === 400) {
      setErrors({ password: response.message }); 
      setSuccessMessage(""); 
    } 
    else {
      setErrors({ general: response.message || "An unexpected error occurred." }); 
      setSuccessMessage(""); 
    }

  };

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

      {/* Edit Email */}
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

      {/* Change Password */}
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
    </Container>
  );
};

export default Profile;
