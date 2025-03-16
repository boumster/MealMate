import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/Auth/AuthProvider";
import { Button } from "../../styles/styles";

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

const HeaderTitle = styled.h1`
  margin: 0 0 0 10px;
`;

const ProfileIcon = styled.img`
  margin-left: auto;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  background-color: white;
`;

interface DropdownMenuProps {
  isOpen: boolean;
}

const DropdownMenu = styled.div<DropdownMenuProps>`
  position: absolute;
  background-color: white;
  color: black;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const MainDropdown = styled(DropdownMenu)`
  top: 40px;
  left: 0;
`;

const ProfileDropdown = styled(DropdownMenu)`
  top: 50px;
  right: 10px;
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
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isAuthenticated, logoutUser } = useAuth();

  return (
    <HeaderContainer>
      <HeaderContent>
  
        <MenuButton onClick={() => setIsMainDropdownOpen(!isMainDropdownOpen)}>
          &#9776;
        </MenuButton>
        <HeaderTitle>MealMate</HeaderTitle>

        <MainDropdown isOpen={isMainDropdownOpen}>
          <DropdownItem href="/">Home</DropdownItem>
          <DropdownItem href="/about">About</DropdownItem>
          <DropdownItem href="/contact">Contact</DropdownItem>
          <DropdownItem href="/mealplans">Meal Plans</DropdownItem>
        </MainDropdown>

        {isAuthenticated ? (
          <>
            <ProfileIcon
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              src="/images/icons/profileIcon.png"
              alt="pfp"
            />
            <ProfileDropdown isOpen={isProfileDropdownOpen}>
              <DropdownItem href="/profile">My Profile</DropdownItem>
              <DropdownItem href="#" onClick={logoutUser}>
                Logout
              </DropdownItem>
            </ProfileDropdown>
          </>
        ) : (
          <LoginButton href="/login">Login</LoginButton>
        )}
      </HeaderContent>
    </HeaderContainer>
  );
}
