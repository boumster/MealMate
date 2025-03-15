import React from "react";
import { useHistory } from "react-router-dom";
import { Container, Button, Paragraph, Label } from "../../styles/styles"; 

const Profile: React.FC = () => {
  const history = useHistory();

  return (
    <Container>
      <Label>Guest Profile</Label>
      <Paragraph>You are not logged in. Please log in to access your profile.</Paragraph>
      <Button onClick={() => history.push("/login")}>Login</Button>
    </Container>
  );
};

export default Profile;
