import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Container, Input, Button, Form, Label, FormRow } from "../../styles/styles";
import { calculateCalories } from "../../utilities/api";
import Loading from "../Loading/Loading";

const ResponsiveContainer = styled(Container)`
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;

    @media (max-width: 768px) {
        padding: 15px;
    }
`;

const Title = styled.h1`
    font-size: 2.5em;
    margin-bottom: 10px;
    text-shadow: 1px 1px 2px #000000;

    @media (max-width: 768px) {
        font-size: 1.8em;
    }
`;

const Subtitle = styled.div`
    padding-bottom: 30px;

    @media (max-width: 768px) {
        padding-bottom: 20px;
        font-size: 0.9em;
    }
`;

const PreviewImage = styled.img`
    max-width: 40%;
    height: auto;
    margin-bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 1);

    @media (max-width: 768px) {
        max-width: 90%;
    }
`;

const ResponsiveFormRow = styled(FormRow)`
    justify-content: center;
    text-align: center;
    padding-right: 320px;
    font-size: 0.9em;

    @media (max-width: 768px) {
        padding-right: 0;
    }
`;

const ResultsContainer = styled.div<{ show: boolean }>`
    display: flex;
    gap: 20px;
    margin: 20px 0;
    font-size: 1.2em;
    align-items: flex-start;
    opacity: ${props => props.show ? 1 : 0};
    transform: translateY(${props => props.show ? '0' : '20px'});
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;

    @media (max-width: 768px) {
        flex-direction: column;
        font-size: 1em;
        gap: 15px;
    }
`;

const Column = styled.div<{ width?: string, borderColor?: string }>`
    flex: ${props => props.width ? 'none' : 1};
    width: ${props => props.width || 'auto'};
    padding: 20px;
    background-color: lightgray;
    border-radius: 8px;
    height: fit-content;
    border: 2px solid ${props => props.borderColor || 'black'};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    word-break: break-word;
    overflow-wrap: break-word;

    @media (max-width: 768px) {
        width: 100%;
        padding: 15px;
    }

    p {
        max-width: 100%;
        overflow-wrap: break-word;
        word-wrap: break-word;
        hyphens: auto;
    }
`;

const IngredientSection = styled.div`
    margin: 8px 0;
`;

const IngredientHeader = styled.div<{ isExpanded: boolean }>`
    cursor: pointer;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding-right: 10px;

    span {
        transform: ${props => props.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'};
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        display: inline-block;
        flex-shrink: 0;
        margin-top: 8px;
    }

    p {
        margin: 8px 0;
        flex: 1;
        min-width: 0;
    }
`;

const IngredientDetails = styled.div<{ isExpanded: boolean }>`
    max-height: ${props => props.isExpanded ? '500px' : '0'};
    opacity: ${props => props.isExpanded ? 1 : 0};
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    margin: 0 0 0 20px;
    word-break: break-word;
    overflow-wrap: break-word;

    @media (max-width: 768px) {
        margin: 0 0 0 10px;
    }

    p {
        margin: 8px 0;
        padding-right: 10px;
        max-width: 100%;
        overflow-wrap: break-word;
        word-wrap: break-word;
        hyphens: auto;
    }
`;

const Divider = styled.hr`
    margin: 10px -20px;
    border: 1px solid white;
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 1.2em;
    margin: 10px 0;
`;

export default function ImageUpload() {
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [calories, setCalories] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedStates, setExpandedStates] = useState<{ [key: number]: boolean }>({});
    const [showResults, setShowResults] = useState(false);
    const resultsRef = useRef<HTMLDivElement>(null);

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

    const handleCalculateCalories = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setExpandedStates({});
        setCalories("");
        setShowResults(false);

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
                setTimeout(() => {
                    setShowResults(true);
                    if (resultsRef.current) {
                        const elementRect = resultsRef.current.getBoundingClientRect();
                        const absoluteElementTop = elementRect.top + window.pageYOffset;
                        const offset = 50;
                        window.scrollTo({
                            top: absoluteElementTop - offset,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            } else {
                setError(data.message || "Failed to calculate calories");
            }
        } catch (error) {
            console.error("Error calculating calories:", error);
            setError("An error occurred while calculating calories");
        }
        setIsLoading(false);
    };

    const toggleExpand = (index: number) => {
        setExpandedStates(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const parseCalories = () => {
        if (!calories) return { ingredientLines: [], totalLines: [] };

        const lines = calories.split("\n").filter(line => line.trim());
        const ingredientLines: string[] = [];
        const totalLines: string[] = [];

        let isTotalSection = false;
        lines.forEach(line => {
            if (line.includes("Total")) isTotalSection = true;
            if (isTotalSection) totalLines.push(line);
            else ingredientLines.push(line);
        });

        return { ingredientLines, totalLines };
    };

    const getIngredientDetails = (startIndex: number, lines: string[]) => {
        const details = [];
        for (let i = startIndex + 1; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes("Ingredient:")) break;
            if (line.includes("Calories:") || line.includes("Proteins:") ||
                line.includes("Fats:") || line.includes("Carbohydrates:")) {
                details.push(line + (!line.includes("g") && !line.includes("kcal")
                    ? (line.includes("Calories") ? " kcal" : " g")
                    : ""));
            } else {
                details.push(line);
            }
        }
        return details;
    };

    const renderResults = () => {
        if (!calories) return null;

        const { ingredientLines, totalLines } = parseCalories();

        return (
            <ResultsContainer ref={resultsRef} show={showResults}>
                <Column>
                    {ingredientLines.map((line, index) => {
                        if (line.includes("Here's the breakdown")) {
                            return (
                                <p key={index} style={{ margin: "-10px 0", fontWeight: "bold", paddingBottom: "10px" }}>
                                    {line}
                                </p>
                            );
                        }
                        if (line.includes("Ingredient:")) {
                            const isExpanded = expandedStates[index] ?? false;
                            const details = getIngredientDetails(index, ingredientLines);
                            return (
                                <IngredientSection key={index}>
                                    {index !== 0 && <Divider />}
                                    <IngredientHeader isExpanded={isExpanded} onClick={() => toggleExpand(index)}>
                                        <span>▸</span>
                                        <p style={{ margin: "8px 0", fontWeight: "bold" }}>{line}</p>
                                    </IngredientHeader>
                                    <IngredientDetails isExpanded={isExpanded}>
                                        {details.map((detail, i) => (
                                            <p key={i}>{detail}</p>
                                        ))}
                                    </IngredientDetails>
                                </IngredientSection>
                            );
                        }
                        return null;
                    })}
                </Column>
                <Column width="300px" borderColor="#3d7cc9">
                    {totalLines.map((line, index) => {
                        const displayLine = line.includes("Total") && !line.includes("g") && !line.includes("kcal")
                            ? line + (line.includes("Calories") ? " kcal" : " g")
                            : line;
                        return (
                            <p key={index} style={{ margin: "8px 0", fontWeight: "bold" }}>
                                {displayLine}
                            </p>
                        );
                    })}
                </Column>
            </ResultsContainer>
        );
    };

    return (
        <ResponsiveContainer>
            <Title>Image to Calories Calculator</Title>
            <Subtitle>
                Upload an image of your food to calculate its calories
            </Subtitle>
            {imagePreview && <PreviewImage src={imagePreview} alt="Selected food" />}
            <Form>
                <ResponsiveFormRow>
                    <Label htmlFor="image" style={{ fontSize: "1.2em" }}></Label>
                    <div>
                        <Input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ fontSize: "1.2em", display: "block", marginBottom: "4px" }}
                        />
                        <p style={{ fontSize: "0.9em", margin: "0", textAlign: "center" }}>
                            Supported formats: .jpg, .jpeg, .png, .webp, .heic, .gif
                        </p>
                    </div>
                </ResponsiveFormRow>
                <Button
                    onClick={handleCalculateCalories}
                    disabled={isLoading}
                    style={{
                        fontSize: "1.2em",
                        padding: "10px 20px",
                        marginTop: "10px",
                        fontWeight: "bold"
                    }}
                >
                    {isLoading ? <Loading size="small" /> : "Calculate Calories"}
                </Button>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                {calories && renderResults()}
            </Form>
        </ResponsiveContainer>
    );
}