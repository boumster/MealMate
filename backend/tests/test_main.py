import pytest
import sys
import os
import base64
import pytest
import unittest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from pydantic import ValidationError

# Application-specific imports
from api.main import app
from api.database import DatabaseConnection
from api.LLM import GeminiLLM
from api.models import UserData, LoginData, ChangeData, MealPlanRequest, MealPlanRetrieve, IndividualMealPlanRetrieve


@pytest.fixture
def client():
    with TestClient(app) as client:
        yield client


def test_about_route(client):
    response = client.get("/about")
    assert response.status_code == 200
    assert response.json() == {"message": "This is the about page."}
    

# Test for UserData model
def test_user_data():
    valid_data = {
        'username': 'testuser',
        'email': 'testuser@example.com',
        'password': 'securepassword'
    }
    user = UserData(**valid_data)
    assert user.username == 'testuser'
    assert user.email == 'testuser@example.com'
    assert user.password == 'securepassword'

    # Test invalid data (missing field)
    invalid_data = {
        'username': 'testuser',
        'email': 'testuser@example.com'
    }
    with pytest.raises(ValidationError):
        UserData(**invalid_data)

# Test for LoginData model
def test_login_data():
    valid_data = {
        'username': 'testuser',
        'password': 'securepassword'
    }
    login = LoginData(**valid_data)
    assert login.username == 'testuser'
    assert login.password == 'securepassword'

    # Test missing password
    invalid_data = {
        'username': 'testuser'
    }
    with pytest.raises(ValidationError):
        LoginData(**invalid_data)

# Test for ChangeData model (optional fields)
def test_change_data():
    valid_data = {
        'username': 'testuser',
        'originalEmail': 'testuser@example.com',
        'newEmail': 'newemail@example.com',
        'originalPassword': 'oldpassword',
        'newPassword': 'newpassword'
    }
    change = ChangeData(**valid_data)
    assert change.username == 'testuser'
    assert change.originalEmail == 'testuser@example.com'
    assert change.newEmail == 'newemail@example.com'
    assert change.originalPassword == 'oldpassword'
    assert change.newPassword == 'newpassword'

    # Test missing optional fields
    valid_data_no_optional = {
        'username': 'testuser'
    }
    change_no_optional = ChangeData(**valid_data_no_optional)
    assert change_no_optional.username == 'testuser'

# Test for MealPlanRequest model
def test_meal_plan_request():
    valid_data = {
        'id': '123',
        'ingredients': 'tomatoes, cheese',
        'calories': 2000,
        'meal_type': 'lunch',
        'meals_per_day': 3
    }
    meal_plan = MealPlanRequest(**valid_data)
    assert meal_plan.id == '123'
    assert meal_plan.ingredients == 'tomatoes, cheese'
    assert meal_plan.calories == 2000
    assert meal_plan.meal_type == 'lunch'
    assert meal_plan.meals_per_day == 3

    # Test missing required 'id'
    invalid_data = {
        'ingredients': 'tomatoes, cheese',
        'calories': 2000,
        'meal_type': 'lunch',
        'meals_per_day': 3
    }
    with pytest.raises(ValidationError):
        MealPlanRequest(**invalid_data)

# Test for MealPlanRetrieve model
def test_meal_plan_retrieve():
    valid_data = {
        'id': '123'
    }
    meal_plan_retrieve = MealPlanRetrieve(**valid_data)
    assert meal_plan_retrieve.id == '123'

    # Test missing 'id'
    invalid_data = {}
    with pytest.raises(ValidationError):
        MealPlanRetrieve(**invalid_data)

# Test for IndividualMealPlanRetrieve model
def test_individual_meal_plan_retrieve():
    valid_data = {
        'id': '123',
        'meal_id': '456'
    }
    individual_meal_plan_retrieve = IndividualMealPlanRetrieve(**valid_data)
    assert individual_meal_plan_retrieve.id == '123'
    assert individual_meal_plan_retrieve.meal_id == '456'

    # Test missing 'meal_id'
    invalid_data = {
        'id': '123'
    }
    with pytest.raises(ValidationError):
        IndividualMealPlanRetrieve(**invalid_data)
        
        
    

# Create a test client
client = TestClient(app)

# Mock the database object to prevent real database interactions
db = MagicMock()

# 1️⃣ Test meal plan generation
def test_generate_meal_plan():
    request_data = {
        "id": 1,
        "cuisine": "Italian",
        "calories": "500",
        "meal_type": "Dinner",
        "dietary_restriction": "Vegetarian"
    }
    
    response = client.post("/generate-mealplan", json=request_data)
    
    assert response.status_code == 200
    assert "Meal plan generated" in response.json()["message"]

# 2️⃣ Test retrieving all meal plans for a user
def test_retrieve_user_mealplans():
    request_data = {"id": 1}
    
    db.execute_query.return_value = [(1, "Meal Plan - Italian 500cal - January 1, 2025")]

    response = client.post("/get-mealplans", json=request_data)

    assert response.status_code == 200
    assert len(response.json()["mealPlans"]) > 0
    assert response.json()["mealPlans"][0]["title"] == "Meal Plan - Italian 500cal - January 1, 2025"

# 3️⃣ Test retrieving a single meal plan
def test_retrieve_mealplan():
    request_data = {"id": 1, "meal_id": 5}
    
    db.execute_query.return_value = [("Example meal plan data")]

    response = client.post("/get-mealplan", json=request_data)

    assert response.status_code == 200
    assert response.json()["mealPlan"] == "Example meal plan data"

# 4️⃣ Test meal image generation
def test_generate_meal_image():
    request_data = {"recipe": "Meal 1 Recipe Name: Pasta\nMeal 2 Recipe Name: Salad"}
    
    response = client.post("/generate-meal-image/1", json=request_data)

    assert response.status_code == 200
    assert "image" in response.json()

# 5️⃣ Test calorie calculation
def test_calculate_calories():
    file_content = b"fake image data"
    
    response = client.post("/calculate-calories", files={"file": ("test.jpg", file_content, "image/jpeg")})

    assert response.status_code == 200
    assert "calories" in response.json()

# 6️⃣ Test handling missing meal plans
def test_retrieve_empty_mealplans():
    request_data = {"id": 99}  # Assuming user 99 has no saved meal plans
    
    db.execute_query.return_value = []

    response = client.post("/get-mealplans", json=request_data)

    assert response.status_code == 200
    assert response.json()["mealPlans"] == []

# 7️⃣ Test invalid meal ID retrieval
def test_invalid_mealplan():
    request_data = {"id": 1, "meal_id": 999}  # Invalid meal ID
    
    db.execute_query.return_value = []

    response = client.post("/get-mealplan", json=request_data)

    assert response.status_code == 404
    assert "Meal plan not found" in response.json()["message"]

# Run all tests with: pytest


# ✅ Fixture to initialize the GeminiLLM class
@pytest.fixture
def gemini_llm():
    return GeminiLLM()

# ✅ Mocking Gemini API Client
@pytest.fixture
def mock_client():
    mock = MagicMock()
    return mock


# 1️⃣ **Test Meal Plan Generation**
@patch("LLM.genai.Client")  # Mock the API client
def test_generate_completion(mock_client, gemini_llm):
    mock_instance = mock_client.return_value
    mock_instance.models.generate_content.return_value.text = "Mocked Meal Plan Response"
    
    prompt = "High protein diet for athletes"
    response = gemini_llm.generate_completion(prompt)
    
    assert response == "Mocked Meal Plan Response"
    mock_instance.models.generate_content.assert_called_once()


# 2️⃣ **Test Calorie Calculation with Image Data**
@patch("LLM.genai.Client")
def test_calculate_calories(mock_client, gemini_llm):
    mock_instance = mock_client.return_value
    mock_instance.models.generate_content.return_value.text = "Mocked Calorie Calculation"
    
    sample_image_data = b"\x89PNG\r\n\x1a\n"  # Mocked image bytes
    response = gemini_llm.calculate_calories(sample_image_data)
    
    assert response == "Mocked Calorie Calculation"
    mock_instance.models.generate_content.assert_called_once()


# 3️⃣ **Test Image Generation**
@patch("LLM.genai.Client")
def test_generate_image(mock_client, gemini_llm):
    mock_instance = mock_client.return_value
    mock_response = MagicMock()
    mock_response.candidates = [
        MagicMock(content=MagicMock(parts=[MagicMock(inline_data=MagicMock(data=b"mocked image bytes"))]))
    ]
    mock_instance.models.generate_content.return_value = mock_response
    
    prompt = "A delicious Italian pasta dish"
    response = gemini_llm.generate_image(prompt)
    
    assert response == b"mocked image bytes"
    mock_instance.models.generate_content.assert_called_once()


# 4️⃣ **Test Missing API Key Error**
@patch("LLM.load_dotenv", MagicMock())
@patch("LLM.os.getenv", MagicMock(return_value=None))  # Simulate missing API key
def test_missing_api_key():
    with pytest.raises(ValueError, match="GOOGLE_API_KEY not found in environment variables"):
        GeminiLLM()


# 5️⃣ **Test API Client Not Initialized**
def test_generate_completion_uninitialized():
    llm = GeminiLLM()
    llm._client = None  # Manually setting client to None
    with pytest.raises(RuntimeError, match="Google AI client not initialized"):
        llm.generate_completion("Test prompt")


# 6️⃣ **Test Empty Response from API**
@patch("LLM.genai.Client")
def test_calculate_calories_empty_response(mock_client, gemini_llm):
    mock_instance = mock_client.return_value
    mock_instance.models.generate_content.return_value.text = None  # Simulate empty response
    
    sample_image_data = b"fake image data"
    with pytest.raises(ValueError, match="No response generated from the model"):
        gemini_llm.calculate_calories(sample_image_data)


class TestDatabaseConnection(unittest.TestCase):

    @patch('mysql.connector.connect')  # Mock MySQL connection
    def test_singleton_instance(self, mock_connect):
        """Test that only one instance of DatabaseConnection is created."""
        db1 = DatabaseConnection()
        db2 = DatabaseConnection()
        self.assertIs(db1, db2)  # Singleton should return the same instance

    @patch('mysql.connector.connect')
    def test_successful_connection(self, mock_connect):
        """Test successful database connection."""
        mock_conn = MagicMock()
        mock_connect.return_value = mock_conn

        db = DatabaseConnection()
        self.assertIsNotNone(db.conn)  # Ensure connection is initialized
        self.assertTrue(mock_connect.called)  # Ensure connect was called

    @patch('mysql.connector.connect')
    def test_failed_connection(self, mock_connect):
        """Test failed database connection raises an exception."""
        mock_connect.side_effect = Exception("Database connection error")
        with self.assertRaises(Exception) as context:
            DatabaseConnection()

        self.assertTrue("Database connection error" in str(context.exception))

    @patch('mysql.connector.connect')
    def test_execute_select_query(self, mock_connect):
        """Test executing a SELECT query returns results."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.fetchall.return_value = [("John", "Doe")]
        mock_conn.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        db = DatabaseConnection()
        result = db.execute_query("SELECT * FROM users")
        self.assertEqual(result, [("John", "Doe")])  # Ensure query result is returned

    @patch('mysql.connector.connect')
    def test_execute_insert_query(self, mock_connect):
        """Test executing an INSERT query commits changes."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        db = DatabaseConnection()
        result = db.execute_query("INSERT INTO users (name) VALUES (%s)", ("Alice",))
        
        mock_cursor.execute.assert_called_once_with("INSERT INTO users (name) VALUES (%s)", ("Alice",))
        mock_conn.commit.assert_called_once()  # Ensure commit is called
        self.assertEqual(result, [])  # Should return empty list for non-SELECT queries

    @patch('mysql.connector.connect')
    def test_execute_query_error(self, mock_connect):
        """Test that an error during query execution raises an exception."""
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_cursor.execute.side_effect = Exception("Query execution error")
        mock_conn.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        db = DatabaseConnection()
        with self.assertRaises(Exception) as context:
            db.execute_query("SELECT * FROM users")

        self.assertTrue("Query execution error" in str(context.exception))

if __name__ == "__main__":
    unittest.main()
