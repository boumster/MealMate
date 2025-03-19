import {
  Container,
  Title,
  Paragraph,
  List,
  ListItem,
} from "../../styles/styles";

export default function About() {
  return (
    <Container>
      <Title>About MealMate</Title>
      <Paragraph>
        Welcome to <strong>MealMate</strong> – your ultimate diet planning
        assistant! Our mission is to help you achieve your health and wellness
        goals with personalized meal plans powered by <strong>Gemini AI</strong>
        .
      </Paragraph>
      <Paragraph>
        Whether you're looking to lose weight, build muscle, or maintain a
        balanced diet, MealMate provides intelligent recommendations based on
        your preferences, dietary restrictions, and fitness goals.
      </Paragraph>
      <Title>Our Features</Title>
      <List>
        <ListItem>✅ AI-Powered Meal Planning with Gemini AI</ListItem>
        <ListItem>✅ Customizable Diet Plans</ListItem>
        <ListItem>✅ Calorie and Nutrient Tracking</ListItem>
        <ListItem>✅ Easy-to-Follow Recipes</ListItem>
        <ListItem>✅ Grocery List Generation</ListItem>
      </List>
      <Title>Our Vision</Title>
      <Paragraph>
        At MealMate, we believe that healthy eating should be simple and
        enjoyable. Our AI-driven approach helps users make informed food choices
        while ensuring variety and nutritional balance.
      </Paragraph>
    </Container>
  );
}
