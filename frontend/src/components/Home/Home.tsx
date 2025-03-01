import React from "react";
import {Container} from "../../styles/styles";

export default function Home({ message }: { message: string }) {
  return (
    <Container>
      <h2>Home</h2>
      <p>Welcome to the home page!</p>
      <p>{message}</p>
    </Container>
  );
}
