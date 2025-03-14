import React, { useState } from "react";
import {
  Container,
  Input,
  Button,
  Form,
  Label,
  FormRow,
} from "../../styles/styles";
import { generateMealPlan } from "../../utilities/api";

export default function Mealplans() {
  const [ingredients, setIngredients] = useState("");
  const [calories, setCalories] = useState("");
  const [mealPlan, setMealPlan] = useState("");
  const [mealType, setMealType] = useState("");
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [favoriteIngredients, setFavoriteIngredients] = useState("");
  const [dislikedIngredients, setDislikedIngredients] = useState("");
  const [cookingSkill, setCookingSkill] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [availableIngredients, setAvailableIngredients] = useState("");
  const [budget, setBudget] = useState("");
  const [groceryStores, setGroceryStores] = useState("");

  const handleGenerateMealPlan = async () => {
    const requestData = {
      ingredients,
      calories,
      mealType,
      mealsPerDay,
      cuisine,
      favoriteIngredients,
      dislikedIngredients,
      cookingSkill,
      cookingTime,
      availableIngredients,
      budget,
      groceryStores,
    };
  
    try {
      // Call the API utility function
      const data = await generateMealPlan(requestData); // Assuming `generateMealPlan` already parses the JSON
      console.log(data);
  
      if (data.status === 200) {
        setMealPlan(data.response); // Use the parsed response directly
      } else {
        console.error("Failed to generate meal plan:", data.message);
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
    }
  };


  return (
    <Container>
      <h2>Meal Plans</h2>
      <p>
        Please fill out the form below with your preferences and requirements to
        generate a personalized meal plan.
      </p>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerateMealPlan();
        }}
      >
        <FormRow>
          <Label>
            Ingredients:
            <Input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Enter ingredients you have"
            />
          </Label>
          <Label>
            Calories:
            <Input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Enter desired calories"
            />
          </Label>
        </FormRow>
        <FormRow>
          <Label>
            Preferred Meal Types:
            <Input
              type="text"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              placeholder="Enter preferred meal types (e.g., breakfast, lunch, dinner, snacks)"
            />
          </Label>
          <Label>
            Number of Meals per Day:
            <Input
              type="number"
              value={mealsPerDay}
              onChange={(e) => setMealsPerDay(e.target.value)}
              placeholder="Enter number of meals per day"
            />
          </Label>
        </FormRow>
        <FormRow>
          <Label>
            Cuisine Preferences:
            <Input
              type="text"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="Enter cuisine preferences (e.g., Italian, Indian)"
            />
          </Label>
          <Label>
            Favorite Ingredients:
            <Input
              type="text"
              value={favoriteIngredients}
              onChange={(e) => setFavoriteIngredients(e.target.value)}
              placeholder="Enter favorite ingredients"
            />
          </Label>
        </FormRow>
        <FormRow>
          <Label>
            Disliked Ingredients:
            <Input
              type="text"
              value={dislikedIngredients}
              onChange={(e) => setDislikedIngredients(e.target.value)}
              placeholder="Enter disliked ingredients"
            />
          </Label>
          <Label>
            Cooking Skill Level:
            <Input
              type="text"
              value={cookingSkill}
              onChange={(e) => setCookingSkill(e.target.value)}
              placeholder="Enter cooking skill level (beginner, intermediate, expert)"
            />
          </Label>
        </FormRow>
        <FormRow>
          <Label>
            Time Available for Cooking:
            <Input
              type="text"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              placeholder="Enter time available for cooking (quick meals vs. elaborate meals)"
            />
          </Label>
          <Label>
            Available Ingredients in the Kitchen:
            <Input
              type="text"
              value={availableIngredients}
              onChange={(e) => setAvailableIngredients(e.target.value)}
              placeholder="Enter available ingredients in the kitchen"
            />
          </Label>
        </FormRow>
        <FormRow>
          <Label>
            Budget Constraints for Groceries:
            <Input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter budget constraints for groceries"
            />
          </Label>
          <Label>
            Preferred Grocery Stores or Brands:
            <Input
              type="text"
              value={groceryStores}
              onChange={(e) => setGroceryStores(e.target.value)}
              placeholder="Enter preferred grocery stores or brands"
            />
          </Label>
        </FormRow>
        <Button type="submit">Generate Meal Plan</Button>
      </Form>
      {mealPlan && <p>{mealPlan}</p>}
    </Container>
  );
}
