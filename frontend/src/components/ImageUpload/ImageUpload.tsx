import React, { useState } from "react";
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
        if (e.target.files) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCalculateCalories = async () => {
        if (!image) {
            setError("Please select an image to upload");
            return;
        }
        try {
            const data = await calculateCalories(image);
            console.log(data);
             
            if (data.status === 200 && data.response) {
                setCalories(data.response);
                setError(null);
            } else {
                console.error("Failed to calculate calories:", data.message || "Unknown error");
                setError(data.message || "Failed to calculate calories");
            }
        } catch (error) {
            console.error("Error calculating calories:", error);
            setError("An error occurred while calculating calories");
        }
    };

    const renderCalories = () => {
        if (!calories) return "no calories found";
        return <p>Calories: {calories}</p>;
    };

    return (
        <Container>
            <h1>Calculate Calories</h1>
            {imagePreview && <img src={imagePreview} alt="Selected food" style={{ maxWidth: "30%", height: "auto" }} />}
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