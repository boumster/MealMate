from typing import Optional
from pydantic import BaseModel

class UserData(BaseModel):
    username: str
    email: str
    password: str

class LoginData(BaseModel):
    username: str
    password: str

class ChangeData(BaseModel):
    username: str
    originalEmail: str = None
    newEmail: str = None
    originalPassword: str = None
    newPassword: str = None
    
class MealPlanRequest(BaseModel):
    ingredients: Optional[str] = None
    calories: Optional[int] = None
    meal_type: Optional[str] = None
    meals_per_day: Optional[int] = None
    cuisine: Optional[str] = None
    dietary_restriction: Optional[str] = None
    disliked_ingredients: Optional[str] = None
    cooking_skill: Optional[str] = None
    cooking_time: Optional[str] = None
    available_ingredients: Optional[str] = None
    dietary_goals: Optional[str] = None
    budget_constraints: Optional[str] = None
    id: str
    
class MealPlanRetrieve(BaseModel):
    id: str
    
class IndividualMealPlanRetrieve(BaseModel):
    id: str
    meal_id: str
