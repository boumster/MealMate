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

export default function ImageUpload() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [calories, setCalories] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      // Create image preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setError(null); // Clear any previous errors
    }
  };

  const handleCalculateCalories = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!image) {
      setError("Please select an image to upload");
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
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const renderCalories = () => {
    if (!calories) return <p>No calories found</p>;

    // Split the string by newlines and filter out empty lines
    const lines = calories.split("\n").filter((line) => line.trim());

    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          margin: "20px 0",
        }}
      >
        {lines.map((line, index) => {
          // Check if line contains a colon for ingredient:calorie pairs
          if (line.includes(":")) {
            const [label, value] = line.split(":").map((str) => str.trim());
            return (
              <p key={index} style={{ margin: "8px 0" }}>
                <strong>{label}:</strong>
                {" "}{value}
              </p>
            );
          }
          // For headers or total
          return (
            <p
              key={index}
              style={{
                margin: index === 0 ? "0 0 16px 0" : "16px 0 0 0",
                fontWeight: line.includes("Total") ? "bold" : "normal",
              }}
            >
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <Container>
      <h1>Calculate Calories</h1>
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Selected food"
          style={{ maxWidth: "30%", height: "auto" }}
        />
      )}
      <p>Upload an image to calculate calories</p>
      <p>Supported image formats: .jpg, .jpeg, .png</p>
      <Form>
        <FormRow>
          <Label htmlFor="image">Upload Food Image:</Label>
          <Input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </FormRow>
        <Button onClick={handleCalculateCalories}>Calculate Calories</Button>
        {error && <p>{error}</p>}
        {renderCalories()}
      </Form>
    </Container>
  );
}
