import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../Loading/Loading";
import { useAuth } from "../../context/Auth/AuthProvider";
import { fetchMealPlan, generateMealImage } from "../../utilities/api";
import { Container, Button } from "../../styles/styles";
import '../../styles/Mealplans.css';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext/ThemeContext';
export default function Plan() {
    const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [mealPlanImages, setMealPlanImages] = useState<(string | null)[]>([]);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [contentFade, setContentFade] = useState(false);
  useEffect(() => {
    // Fetch the plan data using the id from the URL
    if (id && user) fetchPlan();
  }, [id]);

  useEffect(() => {
    if (mealPlan) {
      const days = mealPlan.split("Day").slice(1);
      const firstDayContent = days[1]?.trim() || "";
      loadCurrentDayImage(firstDayContent, 1);
    }
  }, [mealPlan]);

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.style.setProperty('--chat-bg', '#34495e');
            root.style.setProperty('--chat-text', '#ecf0f1');
            root.style.setProperty('--chat-input-bg', '#2c3e50');
            root.style.setProperty('--chat-border', '#7f8c8d');
            root.style.setProperty('--chat-assistant-bg', '#2c3e50');
            root.style.setProperty('--chat-shadow', 'rgba(0, 0, 0, 0.3)');
        } else {
            root.style.setProperty('--chat-bg', '#ffffff');
            root.style.setProperty('--chat-text', '#333333');
            root.style.setProperty('--chat-input-bg', '#ffffff');
            root.style.setProperty('--chat-border', '#cccccc');
            root.style.setProperty('--chat-assistant-bg', '#f0f0f0');
            root.style.setProperty('--chat-shadow', 'rgba(0, 0, 0, 0.1)');
        }
    }, [isDarkMode]);

  async function fetchPlan() {
    setIsLoading(true);
    try {
      const response = await fetchMealPlan(id, user?.id);
      setMealPlan(response.mealPlan);
    } catch (error) {
      console.error("Error fetching plan:", error);
    }
    setIsLoading(false);
  }

    const handleDayChange = (newDay: number) => {
        setContentFade(true);

        setTimeout(() => {
            setCurrentDay(newDay);
            const days = mealPlan.split("Day").slice(1);
            const dayContent = days[newDay]?.trim() || "";
            loadCurrentDayImage(dayContent, newDay);
            setContentFade(false);
        }, 300);
    };
  
  

  const extractRecipeName = (dayContent: string): string => {
    const match = dayContent.match(/Recipe Name: (.+?)(?:\n|$)/);
    return match ? match[1].trim() : "";
  };

  // Add this function to load image for current day
  const loadCurrentDayImage = async (dayContent: string, dayIndex: number) => {
    if (!mealPlanImages[dayIndex]) {
      setIsImageLoading(true);
      const recipeName = extractRecipeName(dayContent);
      if (recipeName) {
        const response = await generateMealImage(dayIndex, recipeName);
        if (response?.image) {
          setMealPlanImages((prev) => {
            const newImages = [...prev];
            newImages[dayIndex] = response.image;
            return newImages;
          });
        }
      }
      setIsImageLoading(false);
    }
  };

    const renderMealPlan = () => {
        if (!mealPlan) return null;

        const firstLineMatch = mealPlan.match(/Meal Plan (\d+) Per Day/);
        const dailyCalories = firstLineMatch ? firstLineMatch[1] : "Unknown";

        const days = mealPlan.split("Day").slice(1);
        const currentDayContent = days[currentDay]?.trim() || "";
        const cleanedDayContent = currentDayContent.replace(/^\d+:/, '');

        return (
            <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    Generated Meal Plan ({dailyCalories} Calories Per Day)
                </h3>
                <div style={{ marginBottom: "20px" }}>
                    <Button
                        onClick={() => handleDayChange(Math.max(currentDay - 1, 1))}
                        disabled={currentDay === 1}
                    >
                        Previous Day
                    </Button>
                    <Button
                        onClick={() => handleDayChange(Math.min(currentDay + 1, days.length - 1))}
                        disabled={currentDay === days.length}
                        style={{ marginLeft: "10px" }}
                    >
                        Next Day
                    </Button>
                </div>

                <div className="container">
                    {/* Left Column: Meal Plan */}
                    <div className={`left-column day-content ${contentFade ? 'fade-out' : ''}`}>
                        <h4 style={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            marginTop: 0,
                            paddingBottom: "0.5rem",
                            borderBottom: "2px dashed #ccc",
                            marginBottom: "1rem",
                        }}>
                            Day {currentDay}
                        </h4>
                        <p dangerouslySetInnerHTML={{
                            __html: cleanedDayContent
                                .replace(/Meal \d+:/g, "<strong>$&</strong><br>")
                                .replace(/Recipe Name: (.+)/g, "<strong>Recipe Name:</strong> $1")
                                .replace(/Ingredients:/g, "<strong>Ingredients:</strong>")
                                .replace(/Instructions:/g, "<strong>Instructions:</strong>")
                                .replace(/Calories:/g, "<strong>Calories:</strong>")
                                .replace(/Proteins:/g, "<strong>Proteins:</strong>")
                                .replace(/Fats:/g, "<strong>Fats:</strong>")
                                .replace(/Carbohydrates:/g, "<strong>Carbohydrates:</strong>"),
                        }} />
                    </div>

                    {/* Right Column: Meal Preview */}
                    <div className={`right-column day-content ${contentFade ? 'fade-out' : ''}`}>
                        <h4 style={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            marginTop: 0,
                            marginBottom: "1rem",
                        }}>
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
                                    <div className="modal-overlay" onClick={() => setIsImageModalOpen(false)}>
                                        <img
                                            src={`data:image/jpeg;base64,${mealPlanImages[currentDay]}`}
                                            alt={`Generated meal preview for Day ${currentDay}`}
                                            className="modal-image"
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{
                                width: "100%",
                                height: "400px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f5f5f5",
                                borderRadius: "0.5rem",
                            }}>
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

  if (!mealPlan) {
    return <Loading />;
  }

  return <Container>
    {isLoading ? <Loading /> : renderMealPlan()}
  </Container>;
}
