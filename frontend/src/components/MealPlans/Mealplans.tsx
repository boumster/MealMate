import React, { useState } from 'react';
import { Container, Input, Button } from '../../styles/styles';

export default function Mealplans() {
    const [ingredients, setIngredients] = useState('');
    const [calories, setCalories] = useState('');
    const [mealPlan, setMealPlan] = useState('');

    const handleGenerateMealPlan = () => {
        // Logic to generate meal plan based on user input
        const generatedMealPlan = `Meal plan based on ingredients: ${ingredients} and calories: ${calories}`;
        setMealPlan(generatedMealPlan);
    };

    return (
        <Container>
            <h2>Meal Plans</h2>
            <p>Welcome to the meal plans page!</p>
            <form onSubmit={(e) => { e.preventDefault(); handleGenerateMealPlan(); }}>
                <label>
                    Ingredients:
                    <Input
                        type="text"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="Enter ingredients you have"
                    />
                </label>
                <label>
                    Calories:
                    <Input
                        type="number"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        placeholder="Enter desired calories"
                    />
                </label>
                <Button type="submit">Generate Meal Plan</Button>
            </form>
            {mealPlan && <p>{mealPlan}</p>}
        </Container>
    );
}