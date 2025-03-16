import React, { useEffect } from "react";
import { Container } from "../../styles/styles";
import { fetchAbout } from "../../utilities/api";

export default function Home() {

  return (
    <Container>
      <h2>Home</h2>
      <p>Welcome to the home page!</p>
    </Container>
  );
}
