import pytest
import os
import pytest
import unittest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from pydantic import ValidationError
from api.models import ChatMessage
from api.database import DatabaseConnection
from mysql.connector import Error

os.environ['GOOGLE_API_KEY'] = 'mock_api_key'

with patch('api.database.DatabaseConnection', return_value=MagicMock()):
    from api.main import app
    from api.LLM import GeminiLLM
    from api.models import UserData, LoginData, ChangeData, MealPlanRequest, MealPlanRetrieve, IndividualMealPlanRetrieve, ChatMessage

@pytest.fixture
def client():
    with TestClient(app) as client:
        yield client

def test_about_route(client):
    response = client.get("/about")
    assert response.status_code == 200
    assert response.json() == {"message": "This is the about page."}

@patch('api.main.GeminiLLM.chat_completion', return_value="Mocked AI response")
def test_chat_route(mock_chat_completion, client):
    chat_message = ChatMessage(message="Hello")
    response = client.post("/chat", json=chat_message.model_dump())
    
    assert response.status_code == 200
    assert response.json() == {"status": 200, "response": "Mocked AI response"}

@patch('api.main.GeminiLLM.calculate_calories', return_value="Mocked Calorie Calculation")
def test_calculate_calories(mock_calculate_calories, client):
    file_content = b"fake image data"
    files = {"file": ("test.jpg", file_content, "image/jpeg")}
    
    response = client.post("/calculate-calories", files=files)
    
    assert response.status_code == 200
    assert response.json() == {"status": 200, "calories": "Mocked Calorie Calculation"}

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

    invalid_data = {
        'username': 'testuser',
        'email': 'testuser@example.com'
    }
    with pytest.raises(ValidationError):
        UserData(**invalid_data)

def test_login():
    valid_data = {
        'username': 'testuser',
        'password': 'securepassword'
    }
    login = LoginData(**valid_data)
    assert login.username == 'testuser'
    assert login.password == 'securepassword'

    invalid_data = {
        'username': 'testuser'
    }
    with pytest.raises(ValidationError):
        LoginData(**invalid_data)

def test_change_email():
    valid_data = {
        'username': 'testuser',
        'originalEmail': 'testuser@example.com',
        'newEmail': 'newemail@example.com'
    }
    change = ChangeData(**valid_data)
    assert change.username == 'testuser'
    assert change.originalEmail == 'testuser@example.com'
    assert change.newEmail == 'newemail@example.com'

def test_change_password():
    valid_data = {
        'username': 'testuser',
        'originalPassword': 'oldpassword',
        'newPassword': 'newpassword'
    }
    change = ChangeData(**valid_data)
    assert change.username == 'testuser'
    assert change.originalPassword == 'oldpassword'
    assert change.newPassword == 'newpassword'

def test_change_data_missing_optional_fields():
    valid_data_no_optional = {
        'username': 'testuser'
    }
    change_no_optional = ChangeData(**valid_data_no_optional)
    assert change_no_optional.username == 'testuser'

def test_mealplan_request():
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

    invalid_data = {
        'ingredients': 'tomatoes, cheese',
        'calories': 2000,
        'meal_type': 'lunch',
        'meals_per_day': 3
    }
    with pytest.raises(ValidationError):
        MealPlanRequest(**invalid_data)

def test_mealplan_retrieve():
    valid_data = {
        'id': '123'
    }
    meal_plan_retrieve = MealPlanRetrieve(**valid_data)
    assert meal_plan_retrieve.id == '123'

    invalid_data = {}
    with pytest.raises(ValidationError):
        MealPlanRetrieve(**invalid_data)

def test_individual_mealplan_retrieve():
    valid_data = {
        'id': '123',
        'meal_id': '456'
    }
    individual_meal_plan_retrieve = IndividualMealPlanRetrieve(**valid_data)
    assert individual_meal_plan_retrieve.id == '123'
    assert individual_meal_plan_retrieve.meal_id == '456'

    invalid_data = {
        'id': '123'
    }
    with pytest.raises(ValidationError):
        IndividualMealPlanRetrieve(**invalid_data)
        
def test_initialize_LLM_success():
    with patch('api.LLM.load_dotenv') as mock_load_dotenv, \
         patch('api.LLM.os.getenv', return_value='mock_api_key') as mock_getenv, \
         patch('api.LLM.genai.Client') as mock_client:
        
        llm = GeminiLLM()
        llm._initialize()
        
        mock_load_dotenv.assert_called_once_with('.env')
        mock_getenv.assert_called_once_with('GOOGLE_API_KEY')
        mock_client.assert_called_once_with(api_key='mock_api_key')
        assert llm._client is not None

def test_initialize_missing_api_key():
    with patch('api.LLM.load_dotenv') as mock_load_dotenv, \
         patch('api.LLM.os.getenv', return_value=None) as mock_getenv:
        
        llm = GeminiLLM()
        with pytest.raises(ValueError, match="GOOGLE_API_KEY not found in environment variables"):
            llm._initialize()
        
        mock_load_dotenv.assert_called_once_with('.env')
        mock_getenv.assert_called_once_with('GOOGLE_API_KEY')
        
def test_execute_query_select_success():
    with patch('api.database.mysql.connector.connect') as mock_connect:
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.fetchall.return_value = [('row1',), ('row2',)]
        
        db = DatabaseConnection()
        db.conn = mock_conn
        db.cursor = mock_cursor
        
        query = "SELECT * FROM users"
        result = db.execute_query(query)
        
        mock_cursor.execute.assert_called_once_with(query)
        mock_cursor.fetchall.assert_called_once()
        assert result == [('row1',), ('row2',)]

def test_execute_query_insert_success():
    with patch('api.database.mysql.connector.connect') as mock_connect:
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        
        db = DatabaseConnection()
        db.conn = mock_conn
        db.cursor = mock_cursor
        
        query = "INSERT INTO users (username, email) VALUES (%s, %s)"
        values = ('testuser', 'testuser@example.com')
        result = db.execute_query(query, values)
        
        mock_cursor.execute.assert_called_once_with(query, values)
        mock_conn.commit.assert_called_once()
        assert result == []

def test_execute_query_reconnect():
    with patch('api.database.mysql.connector.connect') as mock_connect:
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_conn.is_connected.return_value = False
        
        db = DatabaseConnection()
        db.conn = mock_conn
        db.cursor = mock_cursor
        
        query = "SELECT * FROM users"
        db.execute_query(query)
        
        mock_conn.is_connected.assert_called_once()
        mock_connect.assert_called_once()
        mock_cursor.execute.assert_called_once_with(query)

def test_execute_query_error():
    with patch('api.database.mysql.connector.connect') as mock_connect:
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.execute.side_effect = Error("Execution error")
        
        db = DatabaseConnection()
        db.conn = mock_conn
        db.cursor = mock_cursor
        
        query = "SELECT * FROM users"
        with pytest.raises(Error, match="Execution error"):
            db.execute_query(query)
        
        mock_cursor.execute.assert_called_once_with(query)

if __name__ == "__main__":
    unittest.main()


# This file was run while being in the backend directory.
# The command used was: pytest tests/test_all.py -v 