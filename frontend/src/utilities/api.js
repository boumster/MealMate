const API_BASE_URL = "https://seng401.vercel.app";

export async function fetchAbout() {
  try {
    const response = await fetch(`${API_BASE_URL}/about`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching about:", error);
  }
}

export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
  }
}

export async function loginUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in user:", error);
  }
}

export async function generateMealPlan(mealPlan) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-meal-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mealPlan),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    return {
      status: 500,
      message: "Error generating meal plan",
      response: null,
      image: null,
    };
  }
}

export async function generateMealImage(day, recipe) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-meal-image/${day}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipe }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating meal image:", error);
    return null;
  }
}

export async function calculateCalories(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/calculate-calories`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchMealPlans(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/get-mealplans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userData.id  // Ensure id is properly passed
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    throw error; // Re-throw to handle in component
  }
}

export async function fetchMealPlan(mealPlanId, userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/get-mealplan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meal_id: mealPlanId,
        id: userId,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    throw error;
  }
};


export async function updateEmail(username, newEmail) {
  try {
    const response = await fetch(`${API_BASE_URL}/update-email`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, newEmail }),
    });

    const data = await response.json();

    return {
      status: response.status,
      ...data, // Spread the JSON response (so message & errors remain intact)
    };
  } catch (error) {
    console.error("Error updating email:", error);
    return { status: 500, message: "An unexpected error occurred." };
  }
}



export async function updatePassword(username, originalPassword, newPassword) {
  try {
    const response = await fetch(`${API_BASE_URL}/update-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        originalPassword,
        newPassword,
      }),
    });

    const data = await response.json(); 

    return { status: response.status, ...data };

  } catch (error) {
    console.error("Error updating password:", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}

