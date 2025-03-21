import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider, createGlobalStyle, styled } from 'styled-components';

const lightTheme = {
    background: '#f5f5f5',
    text: '#333',
    cardBg: 'white',
    border: '#ccc',
    buttonBg: '#3498db',
    buttonText: 'white',
    shadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    navBg: '#ffffff',
    navText: '#333333',
    mealCardBg: '#ffffff',
    mealCardText: '#333333',
    heroBg: '#ffffff',
    heroText: '#333333',
    aboutBg: '#ffffff',
    aboutText: '#333333',
    contactBg: '#ffffff',
    contactText: '#333333',
    inputBg: '#ffffff',
    inputText: '#333333',
    inputBorder: '#cccccc',
    linkColor: '#3498db',
    linkHover: '#2980b9',
    success: '#2ecc71',
    error: '#e74c3c',
    warning: '#f1c40f'
};

const darkTheme = {
    background: '#2c3e50',
    text: '#ecf0f1',
    cardBg: '#34495e',
    border: '#7f8c8d',
    buttonBg: '#2980b9',
    buttonText: 'white',
    shadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    navBg: '#1a1a1a',
    navText: '#ffffff',
    mealCardBg: '#34495e',
    mealCardText: '#ecf0f1',
    heroBg: '#2c3e50',
    heroText: '#ecf0f1',
    aboutBg: '#2c3e50',
    aboutText: '#ecf0f1',
    contactBg: '#2c3e50',
    contactText: '#ecf0f1',
    inputBg: '#34495e',
    inputText: '#ecf0f1',
    inputBorder: '#7f8c8d',
    linkColor: '#3498db',
    linkHover: '#2980b9',
    success: '#27ae60',
    error: '#c0392b',
    warning: '#f39c12'
};

const TransitionOverlay = styled.div<{ isTransitioning: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 60px; // Start below header height
    height: ${props => props.isTransitioning ? 'calc(100% - 60px)' : '0'};
    background-color: ${props => props.theme.background};
    transition: height 0.3s ease-in-out;
    z-index: 998; 
    pointer-events: none;
`;

const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    margin: 0;
    padding: 0;
  }

  .App {
    background-color: ${props => props.theme.background};
    min-height: 100vh;
  }

  a {
    color: ${props => props.theme.linkColor};
    transition: color 0.3s ease-in-out;
    &:hover {
      color: ${props => props.theme.linkHover};
    }
  }

  input, textarea, select {
    background-color: ${props => props.theme.inputBg};
    color: ${props => props.theme.inputText};
    border: 1px solid ${props => props.theme.inputBorder};
    transition: all 0.3s ease-in-out;

    &:focus {
      border-color: ${props => props.theme.linkColor};
      outline: none;
    }
  }

  button {
    transition: all 0.3s ease-in-out;
  }

  nav {
    background-color: ${props => props.theme.navBg};
    color: ${props => props.theme.navText};
  }
`;

const ThemeContext = createContext({
    isDarkMode: false,
    toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setIsDarkMode(!isDarkMode);
            setTimeout(() => {
                setIsTransitioning(false);
            }, 300);
        }, 300); 
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <StyledThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
                <GlobalStyles />
                <TransitionOverlay isTransitioning={isTransitioning} />
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);