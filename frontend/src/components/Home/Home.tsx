import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Container, Button } from "../../styles/styles";



const ButtonContainer = styled.div`
  display: flex;
  align-self: center;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const HeroSection = styled.div`
  text-align: center;
  max-width: 600px;
  margin-bottom: 40px;
`;

const HeroTitle = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  color: #555;
  margin-bottom: 20px;
`;


const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 800px;
`;

const FeatureCard = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export default function Home() {
  const history = useHistory();

  return (
    <Container>
      {/* Hero Section */}
      <HeroSection>
        <HeroTitle>🥗 MealMate - Your Smart Meal Planner</HeroTitle>
        <HeroSubtitle>
          Plan, track, and optimize your meals effortlessly with AI-powered suggestions.
        </HeroSubtitle>
        <ButtonContainer>
            <Button onClick={() => history.push("/login")}>Login</Button>
            <Button onClick={() => history.push("/register")}>Register</Button>
        </ButtonContainer>
      </HeroSection>

      {/* Features Grid */}
      <FeaturesGrid>
        <FeatureCard>
          <h3>🍽️ Personalized Meal Plans</h3>
          <p>Customized meal plans tailored to your dietary needs and goals.</p>
        </FeatureCard>
        <FeatureCard>
          <h3>🛒 Smart Shopping Lists</h3>
          <p>Automatically generate shopping lists based on your meal plans.</p>
        </FeatureCard>
        <FeatureCard>
          <h3>📊 Nutrition Tracking</h3>
          <p>Monitor your daily intake with detailed nutritional breakdowns.</p>
        </FeatureCard>
        <FeatureCard>
          <h3>🤖 AI-Powered Recommendations</h3>
          <p>Get meal suggestions based on your preferences and dietary restrictions.</p>
        </FeatureCard>

        <FeatureCard>
          <h3>📖 About MealMate</h3>
          <p>Learn how MealMate helps you eat better and live healthier.</p>
          <Button onClick={() => history.push("/about")}>About</Button>
        </FeatureCard>
        <FeatureCard>
          <h3>💬 Talk to Our Chatbot</h3>
          <p>Get instant meal advice and nutrition tips from our AI chatbot.</p>
      </FeatureCard>
      </FeaturesGrid>
    </Container>
  );
}
