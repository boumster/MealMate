const API_BASE_URL = "http://localhost:8000"; // Adjust the URL if your backend is hosted elsewhere

export async function fetchRoot() {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching root:", error);
  }
}

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
