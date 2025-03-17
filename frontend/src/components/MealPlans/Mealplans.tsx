import { useState } from "react";
import {
  Container,
  Input,
  Button,
  Form,
  Label,
  FormRow,
  DropDown,
} from "../../styles/styles";
import { generateMealPlan } from "../../utilities/api";
import Loading from "../Loading/Loading";
import "../../styles/Mealplans.css";
import { Multiselect } from "multiselect-react-dropdown";

export default function Mealplans() {
  const [ingredients, setIngredients] = useState("");
  const [caloriesPerDay, setCaloriesPerDay] = useState("");
  const [mealPlan, setMealPlan] = useState("");
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [dislikedIngredients, setDislikedIngredients] = useState("");
  const [cookingSkill, setCookingSkill] = useState("");
  const [availableIngredients, setAvailableIngredients] = useState("");
  const [budget, setBudget] = useState("");
  const [groceryStores, setGroceryStores] = useState("");
  const [currentDay, setCurrentDay] = useState(1);
  const [dietaryRestriction, setDietaryRestriction] = useState("");
  const [selectedCuisinePreferences, setSelectedCuisinePreferences] = useState<
    { name: string; value: string }[]
  >([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState<
    { name: string; value: string }[]
  >([]);
  const [selectedCookingTimes, setSelectedCookingTimes] = useState<
    { name: string; value: string }[]
  >([]);

  const cuisineOptions = [
    {
      name: "All",
      value:
        "italian, indian, mexican, mediterranean, middle eastern, caribbean, and japanese",
    },
    { name: "Italian", value: "italian" },
    { name: "Indian", value: "indian" },
    { name: "Mexican", value: "mexican" },
    { name: "Mediterranean", value: "mediterranean" },
    { name: "Middle Eastern", value: "middle eastern" },
    { name: "Caribbean", value: "caribbean" },
    { name: "Japanese", value: "japanese" },
  ];

  const cookingTimeOptions = [
    { name: "All", value: "quick, moderate, and elaborate" },
    { name: "Quick Meals (≤ 15 min)", value: "quick" },
    { name: "Moderate (30-60 min)", value: "moderate" },
    { name: "Elaborate (60+ min)", value: "elaborate" },
  ];

  const mealTypeOptions = [
    { name: "All", value: "breakfast, lunch, dinner, and snacks" },
    { name: "Breakfast", value: "breakfast" },
    { name: "Lunch", value: "lunch" },
    { name: "Dinner", value: "dinner" },
    { name: "Snacks", value: "snacks" },
  ];
  const [activeTab, setActiveTab] = useState("mealPlan");
  const [mealPlanImage, setMealPlanImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update multiselectStyles object
const multiselectStyles = {
  chips: {
    background: "#007bff",
  },
  multiselectContainer: {
    width: "22.125rem",
    margin: "0.5rem 0"
  },
  searchBox: {
    width: "22.125rem",
    padding: "0.5rem",
    border: "0.1rem solid #ccc",
    borderRadius: "0.4rem"
  },
  optionContainer: {
    width: "22.125rem"
  },
  inputField: {
    margin: 0
  }
};

  // Filter all for cuisine selection
  const handleCuisineSelect = (
    selectedList: { name: string; value: string }[],
    selectedItem: { name: string; value: string }
  ) => {
    if (selectedItem.name === "All") {
      setSelectedCuisinePreferences([selectedItem]);
    } else {
      const filteredList = selectedList.filter((item) => item.name !== "All");
      setSelectedCuisinePreferences(filteredList);
    }
  };

  const handleCuisineRemove = (
    selectedList: { name: string; value: string }[]
  ) => {
    setSelectedCuisinePreferences(selectedList);
  };

  // Filter all for cooking time selection
  const handleCookingTimeSelect = (
    selectedList: { name: string; value: string }[],
    selectedItem: { name: string; value: string }
  ) => {
    if (selectedItem.name === "All") {
      setSelectedCookingTimes([selectedItem]);
    } else {
      const filteredList = selectedList.filter((item) => item.name !== "All");
      setSelectedCookingTimes(filteredList);
    }
  };

  const handleCookingTimeRemove = (
    selectedList: { name: string; value: string }[]
  ) => {
    setSelectedCookingTimes(selectedList);
  };

  // Filter all for meal types selection
  const handleMealTypesSelect = (
    selectedList: { name: string; value: string }[],
    selectedItem: { name: string; value: string }
  ) => {
    if (selectedItem.name === "All") {
      setSelectedMealTypes([selectedItem]);
    } else {
      const filteredList = selectedList.filter((item) => item.name !== "All");
      setSelectedMealTypes(filteredList);
    }
  };

  const handleMealTypesRemove = (
    selectedList: { name: string; value: string }[]
  ) => {
    setSelectedMealTypes(selectedList);
  };

  const handleGenerateMealPlan = async () => {
    setIsLoading(true);

    const mealTypes = selectedMealTypes
      .map((mealType) => mealType.value)
      .join(", ");
    const cuisinePreferences = selectedCuisinePreferences
      .map((cuisinePreference) => cuisinePreference.value)
      .join(", ");
    const cookingTimes = selectedCookingTimes
      .map((cookingTime) => cookingTime.value)
      .join(", ");

    const requestData = {
      ingredients,
      calories: caloriesPerDay,
      meal_type: mealTypes,
      meals_per_day: mealsPerDay,
      cuisine: cuisinePreferences,
      dietary_restriction: dietaryRestriction,
      disliked_ingredients: dislikedIngredients,
      cooking_skill: cookingSkill,
      cooking_time: cookingTimes,
      available_ingredients: availableIngredients,
      budget,
      grocery_stores: groceryStores,
    };

    try {
      const data = await generateMealPlan(requestData);
      if (data.status === 200) {
        setMealPlan(data.response);
        setMealPlanImage(data.image);
      } else {
        console.error("Failed to generate meal plan:", data.message);
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMealPlan = () => {
    if (!mealPlan) return null;

    const firstLineMatch = mealPlan.match(/Meal Plan (\d+) Per Day/);
    const dailyCalories = firstLineMatch ? firstLineMatch[1] : "Unknown";

    const days = mealPlan.split(/Day \d+:/).slice(1);
    const currentDayContent = days[currentDay - 1]?.trim() || "";

    return (
      <div>
        <h3 style={{ fontSize: "2rem", fontWeight: "bold" }}>
          Generated Meal Plan ({dailyCalories} Calories Per Day)
        </h3>
        <h4
          style={{ fontSize: "1.75rem", fontWeight: "bold", marginTop: "10px" }}
        >
          Day {currentDay}
        </h4>

        <div style={{ marginBottom: "20px" }}>
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

        <div
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: "1.5",
            fontSize: "1.2rem",
          }}
        >
          <p
            dangerouslySetInnerHTML={{
              __html: currentDayContent
                .replace(/Meal \d+:/g, "<strong>$&</strong><br>")
                .replace(
                  /Recipe Name: (.+)/g,
                  "<strong>Recipe Name:</strong> $1"
                )
                .replace(/Ingredients:/g, "<strong>Ingredients:</strong>")
                .replace(/Instructions:/g, "<strong>Instructions:</strong>")
                .replace(/Calories:/g, "<strong>Calories:</strong>")
                .replace(/Proteins:/g, "<strong>Proteins:</strong>")
                .replace(/Fats:/g, "<strong>Fats:</strong>")
                .replace(/Carbohydrates:/g, "<strong>Carbohydrates:</strong>"),
            }}
          ></p>
        </div>

        {mealPlanImage && (
          <div style={{ marginTop: "20px" }}>
            <h4 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Meal Preview
            </h4>
            <img
              src={`data:image/jpeg;base64,${mealPlanImage}`}
              alt="Generated meal preview"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Container>
      <h1>Meal Plans</h1>
      {!mealPlan && (
        <p className="container-header">
          Please fill out the form below with your preferences and requirements
          to generate a personalized meal plan.
        </p>
      )}

      {mealPlan ? (renderMealPlan()) : (
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
                placeholder="Enter ingredients you want"
              />
            </Label>
            <Label>
              Calories Per Day:
              <Input
                type="number"
                value={caloriesPerDay}
                onChange={(e) => setCaloriesPerDay(e.target.value)}
                placeholder="Enter desired calories"
              />
              {!caloriesPerDay && (
                <span className="error-message">This field is required</span>
              )}
            </Label>
          </FormRow>
          <FormRow>
            <Label>
              Preferred Meal Types:
              <Multiselect
                options={mealTypeOptions}
                selectedValues={selectedMealTypes}
                onSelect={handleMealTypesSelect}
                onRemove={handleMealTypesRemove}
                displayValue="name"
                placeholder="Select Meal Preferences"
                showArrow={true}
                style={multiselectStyles}
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
              {!mealsPerDay && (
                <span className="error-message">This field is required</span>
              )}
            </Label>
          </FormRow>
          <FormRow>
            <Label>
              Cuisine Preferences:
              <Multiselect
                options={cuisineOptions}
                selectedValues={selectedCuisinePreferences}
                onSelect={handleCuisineSelect}
                onRemove={handleCuisineRemove}
                displayValue="name"
                placeholder="Select Cuisine Preferences"
                showArrow={true}
                style={multiselectStyles}
              />
            </Label>
            <Label>
              Dietary Restrictions:
              <DropDown
                value={dietaryRestriction}
                onChange={(e) => setDietaryRestriction(e.target.value)}
              >
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
              <DropDown
                value={cookingSkill}
                onChange={(e) => setCookingSkill(e.target.value)}
              >
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
                onSelect={handleCookingTimeSelect}
                onRemove={handleCookingTimeRemove}
                displayValue="name"
                placeholder="Select Cooking Times"
                showArrow={true}
                style={multiselectStyles}
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
          <Button
            type="submit"
            disabled={isLoading || !caloriesPerDay || !mealsPerDay}
          >
            {isLoading ? <Loading size="small" /> : "Generate Meal Plan"}
          </Button>
        </Form>
      )}
    </Container>
  );
}
