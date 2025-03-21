import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/Auth/AuthProvider";
import { useTheme } from "../ThemeContext/ThemeContext";
import { Container } from "../../styles/styles";

const HeaderContainer = styled.header`
  background-color: midnightblue;
  padding: 10px;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 999;
  height: 40px;
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
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const HeaderTitle = styled.h1`
  margin: 0 0 0 10px;
  color: white;
`;

const ProfileIcon = styled.img`
  margin-left: 15px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  background-color: white;
`;

const ThemeSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  margin-left: 15px;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: black;
  }

  &:checked + span:before {
    transform: translateX(30px);
    background-color: #c6c6c6;
    box-shadow: inset -4px -2px 0 0 #fff;
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #87CEEB;
  transition: 0.3s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: #f1c40f;
    transition: 0.3s;
    border-radius: 50%;
    box-shadow: inset 8px -4px 0px 0px #fff;
  }

  &:after {
    content: "🌤️";
    position: absolute;
    left: 8px;
    top: 6px;
    font-size: 14px;
    transition: 0.3s;
    opacity: ${props => props.theme.isDarkMode ? 0 : 1};
  }

  ${SwitchInput}:checked + &:after {
    content: "🌙";
    left: 38px;
    opacity: 1;
  }
`;
interface DropdownMenuProps {
  isOpen: boolean;
}

const DropdownMenu = styled.div<DropdownMenuProps>`
  position: absolute;
  background-color: ${props => props.theme.cardBg};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  box-shadow: ${props => props.theme.shadow};
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
  color: ${props => props.theme.text};
  &:hover {
    background-color: ${props => props.theme.background};
  }
`;

export default function Header() {
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isAuthenticated, logoutUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

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
            <DropdownItem href="/myplans">My Plans</DropdownItem>
            <DropdownItem href="/calculate-calories">Calculate Calories</DropdownItem>
          </MainDropdown>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <ThemeSwitch>
              <SwitchInput
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleTheme}
              />
              <Slider />
            </ThemeSwitch>

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
          </div>
        </HeaderContent>
      </HeaderContainer>
  );
}