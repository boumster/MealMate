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
import { Multiselect } from "multiselect-react-dropdown";

export default function Mealplans() {
  const [ingredients, setIngredients] = useState("");
  const [calories, setCalories] = useState("");
  const [mealPlan, setMealPlan] = useState("");
  const [mealType, setMealType] = useState("");
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [dislikedIngredients, setDislikedIngredients] = useState("");
  const [cookingSkill, setCookingSkill] = useState("");
  const [availableIngredients, setAvailableIngredients] = useState("");
  const [budget, setBudget] = useState("");
  const [groceryStores, setGroceryStores] = useState("");
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedCuisinePreferences, setSelectedCuisinePreferences] = useState([]);
  const [dietaryRestriction, setDietaryRestriction] = useState("");
  const [selectedMealTypes, setSelectedMealTypes] = useState([]);
  const [selectedCookingTimes, setSelectedCookingTimes] = useState([]);

  const cuisineOptions = [
    { name: "All", value: "italian, indian, mexican, mediterranean, middle eastern, caribbean, japanese" },
    { name: "Italian", value: "italian" },
    { name: "Indian", value: "indian" },
    { name: "Mexican", value: "mexican" },
    { name: "Mediterranean", value: "mediterranean" },
    { name: "Middle Eastern", value: "middle eastern" },
    { name: "Caribbean", value: "caribbean" },
    { name: "Japanese", value: "japanese" }
  ];

  const cookingTimeOptions = [
    { name: "All", value: "quick, moderate, elaborate" },
    { name: "Quick Meals (≤ 15 min)", value: "quick" },
    { name: "Moderate (30-60 min)", value: "moderate" },
    { name: "Elaborate (60+ min)", value: "elaborate" }
  ];

  const mealTypeOptions = [
    { name: "All", value: "breakfast, lunch, dinner, snacks" },
    { name: "Breakfast", value: "breakfast" },
    { name: "Lunch", value: "lunch" },
    { name: "Dinner", value: "dinner" },
    { name: "Snacks", value: "snacks" },
  ];
  const [activeTab, setActiveTab] = useState("mealPlan");

  const handleGenerateMealPlan = async () => {
    const requestData = {
      ingredients,
      calories,
      mealType,
      mealsPerDay,
      selectedCuisinePreferences,
      dietaryRestriction,
      dislikedIngredients,
      cookingSkill,
      selectedCookingTimes,
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

    // Find the start of the "Recipes" section
    const recipesIndex = mealPlan.indexOf("Recipes");
    const daysContent =
      recipesIndex !== -1 ? mealPlan.slice(0, recipesIndex).trim() : mealPlan;

    // Split the days content into individual days
    const days = daysContent.split(/\*\*Day \d+:\*\*/).slice(1);
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

  const renderRecipes = () => {
    if (!mealPlan) return null;

    // Extract the "Recipes" section from the meal plan
    const recipesIndex = mealPlan.indexOf("Recipes");
    const recipesContent =
      recipesIndex !== -1
        ? mealPlan.slice(recipesIndex).trim()
        : "No recipes found.";

    return (
      <div>
        <h3>Recipes</h3>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
          <p
            dangerouslySetInnerHTML={{
              __html: recipesContent.replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>"
              ),
            }}
          ></p>
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
        <div>
          <div style={{ marginBottom: "20px" }}>
            <Button
              onClick={() => setActiveTab("mealPlan")}
              style={{
                marginRight: "10px",
                backgroundColor: activeTab === "mealPlan" ? "#007bff" : "#ccc",
                color: activeTab === "mealPlan" ? "#fff" : "#000",
              }}
            >
              Meal Plan
            </Button>
            <Button
              onClick={() => setActiveTab("recipes")}
              style={{
                backgroundColor: activeTab === "recipes" ? "#007bff" : "#ccc",
                color: activeTab === "recipes" ? "#fff" : "#000",
              }}
            >
              Recipes
            </Button>
          </div>
          {activeTab === "mealPlan" && renderMealPlan()}
          {activeTab === "recipes" && renderRecipes()}
        </div>
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
              <Multiselect
                options={mealTypeOptions} 
                selectedValues={selectedMealTypes} 
                onSelect={setSelectedMealTypes} 
                onRemove={setSelectedMealTypes} 
                displayValue="name"
                placeholder="Select Meal Preferences"
                showArrow={true}
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
              <Multiselect
                options={cuisineOptions} 
                selectedValues={selectedCuisinePreferences} 
                onSelect={setSelectedCuisinePreferences} 
                onRemove={setSelectedCuisinePreferences} 
                displayValue="name"
                placeholder="Select Cuisine Preferences"
                showArrow={true}
              />
            </Label>
            <Label>
              Dietary Restrictions:
              <DropDown value={dietaryRestriction} onChange={(e) => setDietaryRestriction(e.target.value)}>
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
              <DropDown value={cookingSkill} onChange={(e) => setCookingSkill(e.target.value)}>
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
              <Multiselect
                options={cookingTimeOptions} 
                selectedValues={selectedCookingTimes} 
                onSelect={setSelectedCookingTimes} 
                onRemove={setSelectedCookingTimes} 
                displayValue="name"
                placeholder="Select Cooking Times"
                showArrow={true}
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
      )}
    </Container>
  );
}
