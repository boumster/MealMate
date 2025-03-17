import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 6rem;
  margin: 0;
  color: #3f51b5;
`;

const Message = styled.p`
  font-size: 1.5rem;
  margin: 2rem 0;
`;

const HomeLink = styled(Link)`
  padding: 1rem 2rem;
  background-color: #3f51b5;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #303f9f;
  }
`;

export default function NotFound() {
    return (
        <NotFoundContainer>
            <Title>404</Title>
            <Message>Oops! Page not found</Message>
            <HomeLink to="/">Return Home</HomeLink>
        </NotFoundContainer>
    );
}