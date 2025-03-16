import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/Auth/AuthProvider";

const HeaderContainer = styled.header`
  background-color: #3f51b5;
  padding: 10px;
  color: white;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
`;

const HeaderTitle = styled.h1`
  margin: 0 0 0 10px;
`;

const LoginButton = styled.a`
  margin-left: auto;
  padding: 8px 16px;
  text-decoration: none;
  font-weight: bold;
  color: black;
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #d9d9d9;
  }
`;

interface DropdownMenuProps {
  isOpen: boolean;
}

const DropdownMenu = styled.div<DropdownMenuProps>`
  position: absolute;
  top: 40px;
  left: 0;
  background-color: white;
  color: black;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const DropdownItem = styled.a`
  display: block;
  padding: 10px;
  text-decoration: none;
  color: black;
  &:hover {
    background-color: #f0f0f0;
  }
`;

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, logoutUser } = useAuth();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <MenuButton onClick={toggleDropdown}>&#9776;</MenuButton>
        <HeaderTitle>MealMate</HeaderTitle>
        {isAuthenticated ? (
          <LoginButton href="/login" onClick={logoutUser}>
            Logout
          </LoginButton>
        ) : (
          <LoginButton href="/login">Login</LoginButton>
        )}
        <DropdownMenu isOpen={isDropdownOpen}>
          <DropdownItem href="/">Home</DropdownItem>
          <DropdownItem href="/about">About</DropdownItem>
          <DropdownItem href="/contact">Contact</DropdownItem>
          <DropdownItem href="/mealplans">Meal Plans</DropdownItem>
          <DropdownItem href="/calculate-calories">Calculate Calories</DropdownItem>
        </DropdownMenu>
      </HeaderContent>
    </HeaderContainer>
  );
}
