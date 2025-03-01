import React, { useState } from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
    background-color: #3f51b5;
    padding: 10px;
    color: white;
`;

const HeaderContent = styled.div`
    display: flex;
    align-items: center;
    position: relative;
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
    display: ${(props) => (props.isOpen ? 'block' : 'none')};
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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <HeaderContainer>
            <HeaderContent>
                <MenuButton onClick={toggleDropdown}>&#9776;</MenuButton>
                <HeaderTitle>Fitness Pal</HeaderTitle>
                <DropdownMenu isOpen={isDropdownOpen}>
                    <DropdownItem href="/">Home</DropdownItem>
                    <DropdownItem href="/about">About</DropdownItem>
                    <DropdownItem href="/contact">Contact</DropdownItem>
                </DropdownMenu>
            </HeaderContent>
        </HeaderContainer>
    );
}