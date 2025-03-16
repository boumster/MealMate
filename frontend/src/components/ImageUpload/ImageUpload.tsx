import React, { useState, useEffect } from "react";
import {
  Container,
  Input,
  Button,
  Form,
  Label,
  FormRow,
} from "../../styles/styles";
import { calculateCalories } from "../../utilities/api";
import Loading from "../Loading/Loading";

export default function ImageUpload() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [calories, setCalories] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedStates, setExpandedStates] = useState<{ [key: number]: boolean }>({});
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCalculateCalories = async (
      e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    if (!image) {
      setError("Please select an image to upload");
      setIsLoading(false);
      return;
    }
    try {
      const data = await calculateCalories(image);
      if (data.status === 200) {
        setCalories(data.calories);
        setError(null);
      } else {
        setError(data.message || "Failed to calculate calories");
      }
    } catch (error) {
      console.error("Error calculating calories:", error);
      setError("An error occurred while calculating calories");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const toggleExpand = (index: number) => {
    setExpandedStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const renderCalories = () => {
    if (!calories) return <p>No calories found</p>;

    const lines = calories.split("\n").filter((line) => line.trim());
    const ingredientLines: string[] = [];
    const totalLines: string[] = [];

    let isTotalSection = false;
    lines.forEach((line) => {
      if (line.includes("Total")) {
        isTotalSection = true;
      }
      if (isTotalSection) {
        totalLines.push(line);
      } else {
        ingredientLines.push(line);
      }
    });

    const getIngredientDetails = (startIndex: number) => {
      const details = [];
      let unitFound = false;

      for (let i = startIndex + 1; i < ingredientLines.length; i++) {
        const line = ingredientLines[i];
        if (line.includes("Ingredient:")) break;

        // Add values with their units
        if (line.includes("Calories:") ||
            line.includes("Proteins:") ||
            line.includes("Fats:") ||
            line.includes("Carbohydrates:")) {
          if (!line.includes("g") && !line.includes("kcal")) {
            // Add units if missing
            details.push(line + (line.includes("Calories") ? " kcal" : " g"));
          } else {
            details.push(line);
          }
        } else {
          details.push(line);
        }
      }
      return details;
    };

    return (
        <div
            style={{
              display: "flex",
              gap: "20px",
              margin: "20px 0",
              fontSize: "1.2em",
              alignItems: "flex-start",
            }}
        >
          {/* Left column */}
          <div
              style={{
                flex: "1",
                padding: "20px",
                backgroundColor: "lightgray",
                borderRadius: "8px",
                height: "fit-content",
                border: "2px solid black",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
              }}
          >
            {ingredientLines.map((line, index) => {
              if (line.includes("Here's the breakdown")) {
                return (
                    <p key={index} style={{ margin: "8px 0", fontWeight: "bold" }}>
                      {line}
                    </p>
                );
              }
              if (line.includes("Ingredient:")) {
                const isExpanded = expandedStates[index] ?? false;
                const details = getIngredientDetails(index);
                return (
                    <div key={index}>
                      {index !== 0 && (
                          <hr style={{ margin: "10px -20px", border: "1px solid white" }} />
                      )}
                      <div
                          onClick={() => toggleExpand(index)}
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                          }}
                      >
                  <span style={{
                    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                    display: "inline-block"
                  }}>
                    ▸
                  </span>
                        <p style={{ margin: "8px 0", fontWeight: "bold" }}>{line}</p>
                      </div>
                      {isExpanded && (
                          <div style={{ margin: "8px 0 8px 20px" }}>
                            {details.map((detail, i) => (
                                <p key={i}>{detail}</p>
                            ))}
                          </div>
                      )}
                    </div>
                );
              }
              return null;
            })}
          </div>

          {/* Right column */}
          <div
              style={{
                width: "300px",
                padding: "20px",
                backgroundColor: "lightgray",
                borderRadius: "8px",
                height: "fit-content",
                border: "2px solid #3d7cc9",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
              }}
          >
            {totalLines.map((line, index) => {
              // Add units if they're missing
              let displayLine = line;
              if (line.includes("Total")) {
                if (!line.includes("g") && !line.includes("kcal")) {
                  displayLine = line + (line.includes("Calories") ? " kcal" : " g");
                }
              }
              return (
                  <p
                      key={index}
                      style={{
                        margin: "8px 0",
                        fontWeight: "bold",
                      }}
                  >
                    {displayLine}
                  </p>
              );
            })}
          </div>
        </div>
    );
  };

  return (
      <Container style={{ maxWidth: "800px", margin: "0 auto", padding: "40px", textAlign: "center" }}>
        <h1 style={{fontSize: "2.5em", marginBottom: "20px", textShadow: "1px 1px 2px #000000"}}>Image to Calories Calculator</h1>
        <div style={{paddingBottom: "20px"}}>
          Upload an image of your food to calculate its calories
        </div>
        {imagePreview && (
            <img
                src={imagePreview}
                alt="Selected food"
                style={{
                  maxWidth: "30%",
                  height: "auto",
                  marginBottom: "20px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 1)"
                }}
            />
        )}
        <Form>
          <FormRow style={{ justifyContent: "center", textAlign: "center", paddingRight: "320px", fontSize: "0.9em" }}>
            <Label htmlFor="image" style={{ fontSize: "1.2em" }}></Label>
            <Input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                style={{ fontSize: "1.2em", display: "block" }}
            />
          </FormRow>
          <p style={{ fontSize: "0.8em" }}>Supported image formats: .jpg, .jpeg, .png, .webp</p>
          <Button onClick={handleCalculateCalories} style={{ fontSize: "1.2em", padding: "10px 20px", marginTop: "20px", fontWeight: "bold" }}>
            Calculate Calories
          </Button>
          {error && <p style={{ color: "red", fontSize: "1.2em" }}>{error}</p>}
          {isLoading && <Loading />}
          {calories && renderCalories()}
        </Form>
      </Container>
  );
}