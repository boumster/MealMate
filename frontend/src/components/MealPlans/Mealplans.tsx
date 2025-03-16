import React, { useState } from "react";
import {
  Container,
  Input,
  Button,
  Form,
  Label,
  FormRow,
  DropDown
} from "../../styles/styles";
import { generateMealPlan } from "../../utilities/api";
import "../../styles/Mealplans.css";
import Select from "react-select";


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
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedCuisines, setSelectedCuisines] = useState([]);

  const cuisineOptions = [
    { value: "all", label: "All" },
    { value: "italian", label: "Italian" },
    { value: "indian", label: "Indian" },
    { value: "mexican", label: "Mexican" },
    { value: "mediterranean", label: "Mediterranean" },
    { value: "middle_eastern", label: "Middle Eastern" },
    { value: "caribbean", label: "Caribbean" },
    { value: "japanese", label: "Japanese" },
  ];

  const handleCuisineChange = (selectedCuisine) => {
    setSelectedCuisines(selectedCuisine)
  }

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

  const renderMealPlan = () => {
    if (!mealPlan) return null;

    const days = mealPlan.split(/\*\*Day \d+:\*\*/).slice(1);
    const currentDayContent = days[currentDay - 1]?.trim() || "";

    return (
      <div>
        <h3>Generated Meal Plan</h3>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
          <p
            dangerouslySetInnerHTML={{
              __html: currentDayContent.replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>"
              ),
            }}
          ></p>
        </div>
        <div style={{ marginTop: "20px" }}>
          <Button
            onClick={() => setCurrentDay((prev) => Math.max(prev - 1, 1))}
            disabled={currentDay === 1}
          >
            Previous Day
          </Button>
          <Button
            onClick={() =>
              setCurrentDay((prev) => Math.min(prev + 1, days.length))
            }
            disabled={currentDay === days.length}
            style={{ marginLeft: "10px" }}
          >
            Next Day
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Container>
      <h2>Meal Plans</h2>
      {!mealPlan && (
        <p className="container-header">
          Please fill out the form below with your preferences and requirements
          to generate a personalized meal plan.
        </p>
      )}

      {mealPlan ? (
        renderMealPlan()
      ) : (
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
              Calories Per Day:
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
              <DropDown value={mealType} onChange={(e) => setMealType(e.target.value)}>
                <option value="">Select a meal type</option>
                <option value="all meal types">All</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snacks">Snacks</option>
              </DropDown>
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
              Cuisine Preferences:
              <Select
              options={cuisineOptions}
              isMulti={true}
              value={selectedCuisines}
              onChange={handleCuisineChange}
              placeholder="Select cuisine preferences"
            />
            <Label>
              Dietary Restrictions:
              <DropDown value={mealType} onChange={(e) => setMealType(e.target.value)}>
                <option value="">Select a dietary restriction</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-Free</option>
                <option value="halal">Halal</option>
                <option value="kosher">Kosher</option>
                <option value="no restrictions">No Restrictions</option>
              </DropDown>
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
              <DropDown value={mealType} onChange={(e) => setMealType(e.target.value)}>
                <option value="">Select a cooking level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </DropDown>
            </Label>
          </FormRow>
          <FormRow>
            <Label>
              Time Available for Cooking:
              <DropDown value={mealType} onChange={(e) => setMealType(e.target.value)}>
                <option value="">Select time available for cooking</option>
                <option value="quick">Quick Meals (≤ 15 min)</option>
                <option value="moderate">Moderate (30-60 min)</option>
                <option value="elaborate">Elaborate (60+ min)</option>
              </DropDown>
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
      )}
    </Container>
  );
}
