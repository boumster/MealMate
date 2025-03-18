import { useState, useRef } from "react";
import {
  Container,
  Input,
  Button,
  Form,
  Label,
  FormRow,
  DropDown,
} from "../../styles/styles";
import { generateMealImage, generateMealPlan } from "../../utilities/api";
import { useAuth } from "../../context/Auth/AuthProvider";
import Loading from "../Loading/Loading";
import "../../styles/Mealplans.css";
import { Multiselect } from "multiselect-react-dropdown";

export default function Mealplans() {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState("");
  const [caloriesPerDay, setCaloriesPerDay] = useState("1800");
  const [mealPlan, setMealPlan] = useState("");
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [dislikedIngredients, setDislikedIngredients] = useState("");
  const [cookingSkill, setCookingSkill] = useState("");
  const [availableIngredients, setAvailableIngredients] = useState("");
  const [currentDay, setCurrentDay] = useState(1);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [dietaryGoals, setDietaryGoals] = useState("");
  const [budgetConstraints, setBudgetConstraints] = useState("");
  let loadingTimer: NodeJS.Timeout;
  const [dietaryRestriction, setDietaryRestriction] = useState<
    { name: string; value: string }[]
  >([]);
  const [selectedCuisinePreferences, setSelectedCuisinePreferences] = useState<
    { name: string; value: string }[]
  >([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState<
    { name: string; value: string }[]
  >([]);
  const [cookingTime, setCookingTime] = useState("");
  const generateButtonRef = useRef<HTMLButtonElement>(null);
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

  const mealTypeOptions = [
    { name: "All", value: "breakfast, lunch, dinner, and snacks" },
    { name: "Breakfast", value: "breakfast" },
    { name: "Lunch", value: "lunch" },
    { name: "Dinner", value: "dinner" },
    { name: "Snacks", value: "snacks" },
  ];

  const dietaryRestrictionOptions = [
    { name: "Vegetarian", value: "vegetarian" },
    { name: "Vegan", value: "vegan" },
    { name: "Gluten-Free", value: "gluten-free" },
    { name: "Halal", value: "halal" },
    { name: "Kosher", value: "kosher" },
    { name: "No Restrictions", value: "no restrictions" },
  ];

  const [activeTab, setActiveTab] = useState("mealPlan");
  const [mealPlanImages, setMealPlanImages] = useState<(string | null)[]>([]);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingImageRequests, setPendingImageRequests] = useState<Set<number>>(new Set());
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
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


  const handleDietaryRestrictionSelect = (
    selectedList: { name: string; value: string }[],
    selectedItem: { name: string; value: string }
  ) => {
    if (selectedItem.name === "No Restrictions") {
      setDietaryRestriction([selectedItem]);
    } else {
      const filteredList = selectedList.filter(
        (item) => item.name !== "No Restrictions"
      );
      setDietaryRestriction(filteredList);
    }
  };

  const handleDietaryRestrictionRemove = (
    selectedList: { name: string; value: string }[]
  ) => {
    setDietaryRestriction(selectedList);
  };

  const extractRecipeName = (dayContent: string): string => {
    const match = dayContent.match(/Recipe Name: (.+?)(?:\n|$)/);
    return match ? match[1].trim() : "";
  };
  
  const preloadNextImages = async (currentDay: number) => {
    for (let i = 1; i <= 4; i++) {
      const nextDay = currentDay + i;
      if (nextDay <= 7 && !mealPlanImages[nextDay] && !pendingImageRequests.has(nextDay)) {
        // Get the days from meal plan
        const days = mealPlan.split("Day").slice(1);
        const nextDayContent = days[nextDay]?.trim();

        if (nextDayContent) {
          setPendingImageRequests(prev => {
            const newSet = new Set(Array.from(prev));
            newSet.add(nextDay);
            return newSet;
          });

          try {
            const response = await generateMealImage(nextDay, nextDayContent);
            if (response?.image) {
              setMealPlanImages(prev => {
                const newImages = [...prev];
                newImages[nextDay] = response.image;
                return newImages;
              });
            }
          } catch (error) {
            console.error(`Failed to preload image for day ${nextDay}:`, error);
          } finally {
            setPendingImageRequests(prev => {
              const newSet = new Set(Array.from(prev));
              newSet.delete(nextDay);
              return newSet;
            });
          }
        }
      }
    }
  };

  const handleDayChange = (day: number) => {
    setCurrentDay(day);

    if (!mealPlanImages[day] && !pendingImageRequests.has(day) && mealPlan?.[day]) {
      setPendingImageRequests(prev => new Set(prev).add(day));
      const recipe = mealPlan[day].split('\n').join('\n');
      setIsImageLoading(true);

      generateMealImage(day, recipe)
          .then(response => {
            if (response?.image) {
              setMealPlanImages(prev => {
                const newImages = [...prev];
                newImages[day] = response.image;
                return newImages;
              });
            }
          })
          .finally(() => {
            setIsImageLoading(false);
            setPendingImageRequests(prev => {
              const newSet = new Set(prev);
              newSet.delete(day);
              return newSet;
            });
          });
    }
    
    preloadNextImages(day);
  };

  const handleGenerateMealPlan = async () => {
    setIsLoading(true);
    setLoadingMessage("Cooking Up a Meal Plan...");
    loadingTimer = setTimeout(() => {
      setLoadingMessage(
        "A Perfect Meal Plan Takes Time, Please Be Patient While We Personalize You A Plan..."
      );
    }, 5000);

    // Scroll to the button with smooth animation
    setTimeout(() => {
      if (generateButtonRef.current) {
        generateButtonRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 200); 

    const mealTypes = selectedMealTypes
      .map((mealType) => mealType.value)
      .join(", ");
    const cuisinePreferences = selectedCuisinePreferences
      .map((cuisinePreference) => cuisinePreference.value)
      .join(", ");
    const dietaryRestrictions = dietaryRestriction
      .map((restriction) => restriction.value)
      .join(", ");

    const requestData = {
      ingredients,
      calories: caloriesPerDay,
      meal_type: mealTypes,
      meals_per_day: mealsPerDay,
      cuisine: cuisinePreferences,
      dietary_restriction: dietaryRestrictions,
      disliked_ingredients: dislikedIngredients,
      cooking_skill: cookingSkill,
      cooking_time: cookingTime,
      available_ingredients: availableIngredients,
      dietary_goals: dietaryGoals,
      budget_constraints: budgetConstraints,
      id: user?.id,
    };

    try {
      const data = await generateMealPlan(requestData);
      if (data.status === 200) {
        setMealPlan(data.response);
        setMealPlanImages(new Array(7).fill(null));
        const days = data.response.split("Day").slice(1);

        // Load first day image
        const firstDayContent = days[1]?.trim() || "";
        if (firstDayContent) {
          setPendingImageRequests(new Set([1]));
          const firstDayResponse = await generateMealImage(1, firstDayContent);
          if (firstDayResponse?.image) {
            setMealPlanImages(prev => {
              const newImages = [...prev];
              newImages[1] = firstDayResponse.image;
              return newImages;
            });
          }
          setPendingImageRequests(new Set());
        }

        // Start preloading next days
        // Update the handleGenerateMealPlan function's preloading part
        for (let i = 2; i <= 4; i++) {
          if (days[i]) {
            const dayContent = days[i].trim();
            setPendingImageRequests(prev => {
              const newSet = new Set(Array.from(prev));
              newSet.add(i);
              return newSet;
            });
            generateMealImage(i, dayContent)
                .then(response => {
                  if (response?.image) {
                    setMealPlanImages(prev => {
                      const newImages = [...prev];
                      newImages[i] = response.image;
                      return newImages;
                    });
                  }
                })
                .finally(() => {
                  setPendingImageRequests(prev => {
                    const newSet = new Set(Array.from(prev));
                    newSet.delete(i);
                    return newSet;
                  });
                });
          }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
    } finally {
      clearTimeout(loadingTimer);
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const renderMealPlan = () => {
    if (!mealPlan) return null;

    const firstLineMatch = mealPlan.match(/Meal Plan (\d+) Per Day/);
    const dailyCalories = firstLineMatch ? firstLineMatch[1] : "Unknown";

    const costMatch = mealPlan.match(/Estimated Weekly Cost: \$(\d+)/);
    const estimatedCost = costMatch ? `$${costMatch[1]}` : "Unknown";

    const days = mealPlan.split("Day").slice(1);
    const currentDayContent = days[currentDay]?.trim() || "";

    const cleanedDayContent = currentDayContent.replace(/^\d+:/, '');

    return (
      <div>
        <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Generated Meal Plan ({dailyCalories} Calories Per Day) - Estimated Weekly Cost: {estimatedCost}
        </h3>
        <div style={{ marginBottom: "20px" }}>
          <Button
            onClick={() => handleDayChange(Math.max(currentDay - 1, 1))}
            disabled={currentDay === 1}
          >
            Previous Day
          </Button>
          <Button
            onClick={() =>
              handleDayChange(Math.min(currentDay + 1, days.length - 1))
            }
            disabled={currentDay === days.length}
            style={{ marginLeft: "10px" }}
          >
            Next Day
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "flex-start",
          }}
        >
          {/* Left Column: Meal Plan */}
          <div
            style={{
              flex: "1",
              whiteSpace: "pre-wrap",
              lineHeight: "1.5",
              fontSize: "1rem",
              backgroundColor: "#fff",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            <h4
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginTop: 0,
                paddingBottom: "0.5rem",
                borderBottom: "2px dashed #ccc",
                marginBottom: "1rem",
              }}
            >
              Day {currentDay}
            </h4>
            <p
              dangerouslySetInnerHTML={{
                __html: cleanedDayContent
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
                  .replace(
                    /Carbohydrates:/g,
                    "<strong>Carbohydrates:</strong>"
                  ),
              }}
            />
          </div>

          {/* Right Column: Meal Preview */}
          <div
            style={{
              width: "48%",
              position: "sticky",
              top: "2rem",
            }}
          >
            <h4
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                marginTop: 0,
                marginBottom: "1rem",
              }}
            >
              Meal Preview for Day {currentDay}
            </h4>
            {mealPlanImages[currentDay] ? (
              <>
                <img
                  src={`data:image/jpeg;base64,${mealPlanImages[currentDay]}`}
                  alt={`Generated meal preview for Day ${currentDay}`}
                  style={{
                    width: "100%",
                    minHeight: "600px",
                    maxHeight: "800px",
                    objectFit: "cover",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    opacity: 0.8,
                    transition: "opacity 0.3s ease-in-out",
                    cursor: "zoom-in",
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onClick={() => setIsImageModalOpen(true)}
                />
                {isImageModalOpen && (
                  <div
                    className="modal-overlay"
                    onClick={() => setIsImageModalOpen(false)}
                  >
                    <img
                      src={`data:image/jpeg;base64,${mealPlanImages[currentDay]}`}
                      alt={`Generated meal preview for Day ${currentDay}`}
                      className="modal-image"
                    />
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "400px", // Match the image height
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "0.5rem",
                }}
              >
                {isImageLoading ? (
                  <Loading size="medium" />
                ) : (
                  <p>Image will be generated when you view this day</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Container>
      <h1>Meal Plans</h1>
      {!mealPlan && !isLoading && (
        <p className="container-header">
          Please fill out the form below with your preferences and requirements
          to generate a personalized meal plan.
        </p>
      )}

      {mealPlan ? (
        renderMealPlan()
      ) : isLoading ? (
        <>
          <Loading />
          {loadingMessage && (
            <div
              style={{
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              {loadingMessage.split("").map((char, index) => (
                <span
                  key={index}
                  style={{
                    display: "inline-block",
                    color: "#666",
                    fontSize: "1rem",
                    animation: "waveText 2s ease-in-out infinite",
                    animationDelay: `${index * 0.05}s`,
                    marginLeft: char === " " ? "0.4em" : "0.1em",
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          )}
        </>
      ) : (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerateMealPlan();
          }}
        >
          <FormRow>
            <Label>
              Ingredients: (Opt.)
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
                onChange={(e) => {
                  let value = Number(e.target.value);
                  if (value > 0){
                  setCaloriesPerDay(e.target.value)
                }
                  else {
                    setCaloriesPerDay("1");
                  }
                }}
                placeholder="Enter desired calories"
              />
              {!caloriesPerDay && (
                <span className="error-message">This field is required</span>
              )}
            </Label>
          </FormRow>
          <FormRow>
            <Label>
              Preferred Meal Types: (Opt.)
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
                onChange={(e) => {
                  let value = Number(e.target.value);
                  if (value > 0 && value < 6) {
                    setMealsPerDay(e.target.value);
                  } else if (value === 0) {
                    setMealsPerDay("1");
                  } else {
                    setMealsPerDay("5");
                  }
                }}
                placeholder="Enter number of meals per day"
              />
              {!mealsPerDay && (
                <span className="error-message">This field is required</span>
              )}
            </Label>
          </FormRow>
          <FormRow>
            <Label>
              Cuisine Preferences: (Opt.)
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
              Dietary Restrictions: (Opt.)
              <Multiselect
                options={dietaryRestrictionOptions}
                selectedValues={dietaryRestriction}
                onSelect={handleDietaryRestrictionSelect}
                onRemove={handleDietaryRestrictionRemove}
                displayValue="name"
                placeholder="Select Dietary Restriction"
                showArrow={true}
                style={multiselectStyles}
              />
            </Label>
          </FormRow>
          <FormRow>
            <Label>
              Disliked Ingredients: (Opt.)
              <Input
                type="text"
                value={dislikedIngredients}
                onChange={(e) => setDislikedIngredients(e.target.value)}
                placeholder="Enter disliked ingredients"
              />
            </Label>
            <Label>
              Cooking Skill Level: (Opt.)
              <DropDown
                value={cookingSkill}
                onChange={(e) => setCookingSkill(e.target.value)}
              >
                <option value="">Select cooking skill</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </DropDown>
            </Label>
          </FormRow>
          <FormRow>
            <Label>
              Time Available for Cooking: (Opt.)
              <DropDown
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
              >
                <option value="">Select meal times</option>
                <option value="quick">Quick Meals (≤ 15 min)</option>
                <option value="moderate">Moderate (30-60 min)</option>
                <option value="elaborate">Elaborate (60+ min)</option>
              </DropDown>
            </Label>
            <Label>
              Available Ingredients in the Kitchen: (Opt.)
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
              Dietary Goals: (Opt.)
              <Input
                type="text"
                value={dietaryGoals}
                onChange={(e) => setDietaryGoals(e.target.value)}
                placeholder="Enter any dietary goals you have (ex. weight loss)"
              />
            </Label>
            <Label>
              Budget Constraints: (Opt.)
              <Input
                type="text"
                value={budgetConstraints}
                onChange={(e) => {
                  let value = Number(e.target.value);
                  if (value >= 0){
                  setBudgetConstraints(e.target.value)
                }
                  else {
                    setBudgetConstraints("1");
                  }
                }}
                placeholder="Enter any budget constraints you have"
              />
            </Label>
          </FormRow>
          <Button
            ref={generateButtonRef}
            type="submit"
            disabled={isLoading || !caloriesPerDay || !mealsPerDay}
          >
            Generate Meal Plan
          </Button>
              {loadingMessage && (
                  <div style={{
                    marginTop: "10px",
                    textAlign: "center"
                  }}>
                    {loadingMessage.split('').map((char, index) => (
                        <span
                            key={index}
                            style={{
                              display: "inline-block",
                              color: "#666",
                              fontSize: "1rem",
                              animation: "waveText 2s ease-in-out infinite",
                              animationDelay: `${index * 0.05}s`,
                              marginLeft: char === ' ' ? '0.4em' : '0.1em'
                            }}
                        >
        {char}
      </span>
                    ))}
                  </div>
              )}
        </Form>
      )}
    </Container>
  );
}
