import styled from "styled-components";
import {
    Container,
    Title,
    Paragraph,
    List,
    ListItem,
} from "../../styles/styles";

const StyledContainer = styled(Container)`
    background-color: ${props => props.theme.cardBg};
    color: ${props => props.theme.text};
`;

const StyledTitle = styled(Title)`
    color: ${props => props.theme.text};
    margin-top: 1.5rem;
`;

const StyledParagraph = styled(Paragraph)`
    color: ${props => props.theme.text};
    strong {
        color: ${props => props.theme.linkColor};
    }
`;

const StyledList = styled(List)`
    color: ${props => props.theme.text};
`;

const StyledListItem = styled(ListItem)`
    color: ${props => props.theme.text};
`;

export default function About() {
    return (
        <StyledContainer>
            <StyledTitle>About MealMate</StyledTitle>
            <StyledParagraph>
                Welcome to <strong>MealMate</strong> – your ultimate diet planning
                assistant! Our mission is to help you achieve your health and wellness
                goals with personalized meal plans powered by <strong>Gemini AI</strong>
                .
            </StyledParagraph>
            <StyledParagraph>
                Whether you're looking to lose weight, build muscle, or maintain a
                balanced diet, MealMate provides intelligent recommendations based on
                your preferences, dietary restrictions, and fitness goals.
            </StyledParagraph>
            <StyledTitle>Our Features</StyledTitle>
            <StyledList>
                <StyledListItem>✅ AI-Powered Meal Planning with Gemini AI</StyledListItem>
                <StyledListItem>✅ Customizable Diet Plans</StyledListItem>
                <StyledListItem>✅ Calorie and Nutrient Tracking</StyledListItem>
                <StyledListItem>✅ Easy-to-Follow Recipes</StyledListItem>
                <StyledListItem>✅ Grocery List Generation</StyledListItem>
            </StyledList>
            <StyledTitle>Our Vision</StyledTitle>
            <StyledParagraph>
                At MealMate, we believe that healthy eating should be simple and
                enjoyable. Our AI-driven approach helps users make informed food choices
                while ensuring variety and nutritional balance.
            </StyledParagraph>
        </StyledContainer>
    );
}