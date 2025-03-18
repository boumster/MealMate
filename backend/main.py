import base64
from fastapi import FastAPI, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from database import DatabaseConnection
import bcrypt
from models import UserData, LoginData, MealPlanRequest, MealPlanRetrieve, IndividualMealPlanRetrieve
from LLM import GeminiLLM
import logging
from datetime import datetime

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
        # First generate the meal plan text
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
            prompt += f" with dietary restrictions: {request.dietary_restriction}"
        if request.disliked_ingredients:
            prompt += f" excluding ingredients: {request.disliked_ingredients}"
        if request.cooking_skill:
            prompt += f" for {request.cooking_skill} cooks"
        if request.cooking_time:
            prompt += f" with a {request.cooking_time} cooking time"
        if request.available_ingredients:
            prompt += f" with available ingredients: {request.available_ingredients}"


        response = ai_model.generate_completion(prompt, role="meal planner")
        
        timestamp = datetime.now().strftime("%B %d, %Y")
        title_parts = []
        
        if request.cuisine:
            title_parts.append(request.cuisine.split(',')[0].strip())
        if request.calories:
            title_parts.append(f"{request.calories}cal")
        if request.meal_type:
            title_parts.append(request.meal_type.split(',')[0].strip())
        if request.dietary_restriction:
            title_parts.append(request.dietary_restriction.split(',')[0].strip())
            
        title = f"Meal Plan - {' '.join(title_parts)} - {timestamp}"

        # store the user's meal plan into sql table
        query = """
            INSERT INTO mealplans (user_id, mealplan, title)
            VALUES (%s, %s, %s)
            """
        values = (request.id, response, title)
        db.execute_query(query, values)

        # Get the last inserted ID
        query = "SELECT LAST_INSERT_ID()"
        result = db.execute_query(query)
        plan_id = result[0][0] if result else None

        # Execute the query
        try:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "status": status.HTTP_200_OK,
                    "message": "Meal plan generated and successfully saved into database",
                    "response": response,
                    "plan_id": plan_id
                }
            )
        except Exception as db_error:
            print(f"Mealplan Database error: {str(db_error)}")
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "message": "Meal plan generated successfully, but an error occurred while saving it to the database."
                }
            )
    except Exception as e:
        print(f"Error generating meal plan: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "An error occurred while generating the meal plan."
            }
        )
    
# create another function that does retrieval of meal plan based on user ID
@app.post("/get-mealplans")
async def retrieve_user_mealplan(request: MealPlanRetrieve) -> JSONResponse:
    try:
        query = """
        SELECT id, title FROM mealplans 
        WHERE user_id = %s
        """
        values = (request.id,) 

        response = db.execute_query(query, values)

        if len(response) == 0:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "status": status.HTTP_200_OK,
                    "message": "User does not have any saved meal plans",
                    "mealPlans": []
                }
            )
        
        # Format the response as an array of objects
        meal_plans = [
            {
                "id": row[0],
                "title": row[1]
            } for row in response
        ]
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": status.HTTP_200_OK,
                "message": "Meal plans retrieved successfully",
                "mealPlans": meal_plans
            }
        )
    except Exception as e:
        print(f"Error retrieving meal plan: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "Error retrieving meal plan",
                "mealPlans": []
            }
        )

@app.post("/get-mealplan")
async def retrieve_mealplan(request: IndividualMealPlanRetrieve) -> JSONResponse:
    try:
        query = """
            SELECT mealplan, day_images, title FROM mealplans
            WHERE id = %s AND user_id = %s
        """
        values = (request.meal_id, request.id)
        response = db.execute_query(query, values)

        if len(response) == 0:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={
                    "status": status.HTTP_404_NOT_FOUND,
                    "message": "Meal plan not found"
                }
            )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": status.HTTP_200_OK,
                "message": "Meal plan retrieved successfully",
                "mealPlan": response[0][0],
                "images": response[0][1] if response[0][1] else {},
                "title": response[0][2]
            }
        )
    except Exception as e:
        logging.error(f"Error retrieving meal plan: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": f"Error retrieving meal plan: {str(e)}"
            }
        )
    

@app.post("/generate-meal-image/{day}")
async def generate_meal_image(day: int, recipe_data: dict) -> JSONResponse:
    try:
        recipe = recipe_data.get('recipe', '')
        meals = recipe.split("Meal ")[1:]  # Split by "Meal " and remove empty first element
        plan_id = recipe_data.get('plan_id')

        if len(meals) > 1:
            # Extract recipe names for both meals
            meal_names = []
            for meal in meals:
                recipe_name = meal.split("Recipe Name: ")[1].split("\n")[0].strip() if "Recipe Name: " in meal else ""
                if recipe_name:
                    meal_names.append(recipe_name)

            image_prompt = (
                f"Generate a photorealistic image with these {len(meal_names)} meals arranged vertically: {', '.join(meal_names)}. "
                f"Each meal should be plated on its own separate white plate. "
                f"Arrange the plates vertically, one below the other, with clear borders or space separating each meal. "
                f"Display meals in the order they appear in the recipe, from top to bottom. "
                f"Use natural lighting and clear details. "
                f"Present in a professional food photography style without text or labels. "
                f"Each dish should look appetizing, properly garnished, and well-presented. "
                f"Use a neutral light background to make each meal stand out. "
                f"Make sure there's clear visual separation between meals with subtle shadows or spacing."
            );
            
        else:
            # Single meal
            image_prompt = (
                f"Generate a photorealistic image of this exact meal: {recipe}. "
                f"Show ONLY ONE plate with this specific dish, photographed from above or at "
                f"a 45-degree angle if the food is inside a glass. "
                f"Use natural lighting and clear details on a white plate. "
                f"Present it in a professional food photography style without any text or labels. "
                f"Do not include multiple plates or other meals. "
                f"Try not to make the food look plain, dry, or unappetizing."
            )

        image_data = ai_model.generate_image(image_prompt)
        image_base64 = base64.b64encode(image_data).decode('utf-8') if image_data else None

        query = """
            UPDATE mealplans
            SET day_images = JSON_MERGE_PATCH(
                COALESCE(day_images, '{}'),
                JSON_OBJECT(?, ?)
            )
            WHERE id = CAST(? AS CHAR(36))
        """

        # Use string values for all parameters
        values = (str(day), image_base64, str(plan_id))
        db.execute_query(query, values)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": status.HTTP_200_OK,
                "message": "Image generated successfully",
                "image": image_base64
            }
        )
    except Exception as e:
        logging.error(f"Error generating image: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": f"Error generating image: {str(e)}"
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
