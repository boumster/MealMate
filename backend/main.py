import base64

from fastapi import FastAPI, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from database import DatabaseConnection
import bcrypt
from models import UserData, LoginData, MealPlanRequest
from LLM import GeminiLLM
import logging

app = FastAPI()
db = DatabaseConnection()
ai_model = GeminiLLM()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# About page route
@app.get("/about")
def about() -> dict[str, str]:
    return {"message": "This is the about page."}

@app.post("/register")
async def register_user(user_data: UserData) -> JSONResponse:
    try:
        # Hash the password
        hashed_password = bcrypt.hashpw(user_data.password.encode("utf-8"), bcrypt.gensalt())
        
        # Check for existing user
        query = """
            SELECT * FROM users 
            WHERE username = %s
        """
        response = db.execute_query(query, (user_data.username,))
        if len(response) > 0:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "status": status.HTTP_400_BAD_REQUEST,
                    "message": "User already exists"
                }
            )
        
        # Create the SQL query with parameterized values
        query = """
            INSERT INTO users (username, email, password) 
            VALUES (%s, %s, %s)
        """
        values = (user_data.username, user_data.email, hashed_password.decode('utf-8'))
        
        # Execute the query
        try:
            db.execute_query(query, values)
            query = """
                SELECT * FROM users 
                WHERE username = %s
            """
            response = db.execute_query(query, (user_data.username,))
            user_data = response[0]
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "status": status.HTTP_200_OK,
                    "message": "User registered successfully",
                    "user": {
                        "id": user_data[0],
                        "username": user_data[1],
                        "email": user_data[2],
                    }
                }
            )
        except Exception as db_error:
            print(f"Database error: {str(db_error)}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "message": "Error creating user"
                }
            )
            
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "An unexpected error occurred"
            }
        )
    
@app.post("/login")
async def login_user(user_data: LoginData) -> JSONResponse:
    try:
        # Create the SQL query with parameterized values to check both username and email
        query = """
            SELECT * FROM users 
            WHERE username = %s OR email = %s
        """
        values = (user_data.username, user_data.username)  # Check both fields
        
        # Execute the query and handle None result
        try:
            rows = db.execute_query(query, values)
            if not rows:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={
                        "status": status.HTTP_401_UNAUTHORIZED,
                        "message": "Invalid credentials"
                    }
                )
        except Exception as db_error:
            print(f"Database error: {str(db_error)}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "message": "Database error occurred"
                }
            )
        
        # Check the password
        try:
            user = rows[0]  # First row from results
            stored_password = user[3]  # Password is at index 3
            
            if bcrypt.checkpw(user_data.password.encode("utf-8"), stored_password.encode("utf-8")):
                return JSONResponse(
                    status_code=status.HTTP_200_OK,
                    content={
                        "status": status.HTTP_200_OK,
                        "message": "Login successful",
                        "user": {
                            "id": user[0],
                            "username": user[1],
                            "email": user[2]
                        }
                    }
                )
        except (IndexError, AttributeError) as e:
            print(f"Password checking error: {str(e)}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "message": "Error processing credentials"
                }
            )
        
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={
                "status": status.HTTP_401_UNAUTHORIZED,
                "message": "Invalid credentials"
            }
        )
            
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "An unexpected error occurred"
            }
        )

@app.post("/generate-meal-plan")
async def generate_meal_plan(request: MealPlanRequest) -> JSONResponse:
    try:
        # Generate a prompt based on the request
        prompt = "Generate a meal plan"
        if request.ingredients:
            prompt += f" using ingredients: {request.ingredients}"
        if request.calories:
            prompt += f" with {request.calories} calories per day"
        if request.meal_type:
            prompt += f" for {request.meal_type} meal types"
        if request.meals_per_day:
            prompt += f" with {request.meals_per_day} meals per day"
        if request.cuisine:
            prompt += f" with {request.cuisine} cuisines"
        if request.dietary_restriction:
            prompt += f" with dietary restriction: {request.dietary_restriction}"
        if request.disliked_ingredients:
            prompt += f" excluding ingredients: {request.disliked_ingredients}"
        if request.cooking_skill:
            prompt += f" for {request.cooking_skill} cooks"
        if request.cooking_time:
            prompt += f" with {request.cooking_time} cooking times"
        if request.available_ingredients:
            prompt += f" with available ingredients: {request.available_ingredients}"
        if request.budget:
            prompt += f" with a budget of {request.budget}"
        if request.grocery_stores:
            prompt += f" with grocery stores: {request.grocery_stores}"
        
        response = ai_model.generate_completion(prompt, role="meal planner")

        image_prompt = f"Generate a photorealistic image of a complete meal plated beautifully with {response}"
        image_data = ai_model.generate_image(image_prompt)

        image_base64 = base64.b64encode(image_data).decode('utf-8') if image_data else None
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": status.HTTP_200_OK,
                "message": "Meal plan generated successfully",
                "response": response,
                "image": image_base64
            }
        )
    except Exception as e:
        print(f"Error generating meal plan: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "Error generating meal plan"
            }
        )



@app.post("/calculate-calories")
async def calculate_calories(file: UploadFile = File(...)) -> JSONResponse:
    try:
        # Log the file details
        logging.info(f"Received file: {file.filename}, content type: {file.content_type}")

        # Read the image data
        image_data = file.file.read()
        logging.info(f"Read {len(image_data)} bytes from the file")

        # Calculate calories using the AI model
        calories = ai_model.calculate_calories(image_data)
        logging.info(f"Calculated calories: {calories}")

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"status": status.HTTP_200_OK, "calories": calories}
        )
    except Exception as e:
        logging.error(f"Error in /calculate-calories endpoint: {e}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"status": status.HTTP_500_INTERNAL_SERVER_ERROR, "message": str(e)}
        )
