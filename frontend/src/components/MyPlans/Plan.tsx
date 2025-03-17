// Plan.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../Loading/Loading";
import { useAuth } from "../../context/Auth/AuthProvider";
import { fetchMealPlan, generateMealImage } from "../../utilities/api";
import { Container, Button } from "../../styles/styles";

interface PlanResponse {
    title: string;
    mealPlan: string;
}

export default function Plan() {
    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();
    const [mealPlan, setMealPlan] = useState<PlanResponse | null>(null);
    const [currentDay, setCurrentDay] = useState(1);
    const [mealPlanImages, setMealPlanImages] = useState<(string | null)[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [pendingImageRequests, setPendingImageRequests] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (id && user) {
            fetchPlanDetails();
        }
    }, [id, user]);

    async function fetchPlanDetails() {
        try {
            const response = await fetchMealPlan(Number(id), user?.id);
            if (response.status === 200) {
                setMealPlan({
                    title: response.mealPlan.split('\n')[0].trim(),
                    mealPlan: response.mealPlan
                });

                // Initialize the first day's image
                const days = response.mealPlan.split("Day").slice(1);
                const firstDayContent = days[0]?.trim();
                if (firstDayContent) {
                    const firstDayResponse = await generateMealImage(1, firstDayContent);
                    if (firstDayResponse?.image) {
                        setMealPlanImages(prev => {
                            const newImages = [...prev];
                            newImages[1] = firstDayResponse.image;
                            return newImages;
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching plan:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const extractRecipeName = (dayContent: string): string => {
        const match = dayContent.match(/Recipe Name: (.+?)(?:\n|$)/);
        return match ? match[1].trim() : "";
    };

    const preloadNextImages = async (currentDay: number, days: string[]) => {
        for (let i = 1; i <= 4; i++) {
            const nextDay = currentDay + i;
            if (nextDay <= 7 && !mealPlanImages[nextDay] && !pendingImageRequests.has(nextDay)) {
                const nextDayContent = days[nextDay - 1]?.trim();
                if (nextDayContent) {
                    setPendingImageRequests(prev => new Set(Array.from(prev).concat(nextDay)));
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

    const loadCurrentDayImage = async (dayContent: string, dayIndex: number) => {
        if (!mealPlanImages[dayIndex] && !pendingImageRequests.has(dayIndex)) {
            setIsImageLoading(true);
            setPendingImageRequests(prev => new Set(Array.from(prev).concat(dayIndex)));
            try {
                const response = await generateMealImage(dayIndex, dayContent);
                if (response?.image) {
                    setMealPlanImages(prev => {
                        const newImages = [...prev];
                        newImages[dayIndex] = response.image;
                        return newImages;
                    });
                }
            } finally {
                setIsImageLoading(false);
                setPendingImageRequests(prev => {
                    const newSet = new Set(Array.from(prev));
                    newSet.delete(dayIndex);
                    return newSet;
                });
            }
        }
    };

    const handleDayChange = (newDay: number) => {
        setCurrentDay(newDay);
        if (mealPlan) {
            const days = mealPlan.mealPlan.split("Day").slice(1);
            const dayContent = days[newDay - 1]?.trim();
            if (dayContent) {
                loadCurrentDayImage(dayContent, newDay);
                preloadNextImages(newDay, days);
            }
        }
    };

    if (isLoading) {
        return (
            <Container>
                <Loading />
            </Container>
        );
    }

    if (!mealPlan) {
        return (
            <Container>
                <h2>Plan not found</h2>
            </Container>
        );
    }

    const days = mealPlan.mealPlan.split("Day").slice(1);
    const currentDayContent = days[currentDay - 1]?.trim() || "";

    return (
        <Container>
            <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {mealPlan.title}
                </h3>
                <div style={{ marginBottom: "20px" }}>
                    <Button
                        onClick={() => handleDayChange(Math.max(currentDay - 1, 1))}
                        disabled={currentDay === 1}
                    >
                        Previous Day
                    </Button>
                    <Button
                        onClick={() => handleDayChange(Math.min(currentDay + 1, days.length))}
                        disabled={currentDay === days.length}
                        style={{ marginLeft: "10px" }}
                    >
                        Next Day
                    </Button>
                </div>

                <div style={{ display: "flex", gap: "2rem" }}>
                    <div style={{ flex: 1, whiteSpace: "pre-wrap" }}>
                        <h3>Day {currentDay}</h3>
                        <div dangerouslySetInnerHTML={{ __html: currentDayContent.replace(/Meal \d+:/g, "<strong>$&</strong><br>")
                                .replace(/Recipe Name: (.+)/g, "<strong>Recipe Name:</strong> $1")
                                .replace(/Ingredients:/g, "<strong>Ingredients:</strong>")
                                .replace(/Instructions:/g, "<strong>Instructions:</strong>")
                                .replace(/Calories:/g, "<strong>Calories:</strong>")
                                .replace(/Proteins:/g, "<strong>Proteins:</strong>")
                                .replace(/Fats:/g, "<strong>Fats:</strong>")
                                .replace(/Carbohydrates:/g, "<strong>Carbohydrates:</strong>") }} />
                    </div>

                    <div style={{ width: "400px" }}>
                        {mealPlanImages[currentDay] ? (
                            <div>
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
                                        cursor: "zoom-in"
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
                            </div>
                        ) : (
                            <div style={{
                                width: "100%",
                                height: "400px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f5f5f5",
                                borderRadius: "0.5rem"
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
        </Container>
    );
}