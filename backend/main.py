from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase_client import supabase
from uuid import UUID
from dependencies import verify_token
from dotenv import load_dotenv
from typing import Optional

load_dotenv
app = FastAPI()


origins = [
    "http://localhost:5173",  # Frontend URL (React Dev)
    "http://127.0.0.1:5173",  # (Optional) in case you're running via 127.0.0.1
    # Add your deployed frontend URLs here in future
]


# Allow CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Habits container
habits = []

################### Defining a Habit model for validation
class Habit(BaseModel):
    name: str

#########
#user_id optional will need to be removed when auth is implimented.
#including this for now so its actually able to function with local id


@app.get("/")
def read_root():
    return {"message": "Api Connection Established"}


### Habit Routing

@app.get("/habits")
async def get_habits(token_payload=Depends(verify_token)):
    try:
        user_id = token_payload["sub"]
        response = supabase.table("habits").select("*").eq("user_id", user_id).execute()

        return response.data
    except Exception as e:
        print("Exception caught in get_habits():", e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/habits")
async def add_habit(habit: dict, token_payload=Depends(verify_token)):
    try:
        user_id = token_payload["sub"]

        new_habit = {
            "name": habit.get("name"),
            "completed": habit.get("completed", False),
            "user_id": user_id
        }
        response = supabase.table("habits").insert(new_habit).execute()

        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.delete("/habits/{habit_id}")
async def delete_habit(habit_id: str, token_payload=Depends(verify_token)):
    try:
        user_id = token_payload["sub"]
        response = supabase.table("habits").delete().eq("id",habit_id).eq("user_id", user_id).execute()

        if response.data:
            return {"message": f"Habit {habit_id} deleted"}
        
        raise HTTPException(status_code=404, detail="Habit not found or not authorized")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/quotes")
def get_quotes():
    return [
    {"id": 1, "text": "The secret of getting ahead is getting started."},
    {"id": 2, "text": "Push yourself, because no one else is going to do it for you."},
    {"id": 3, "text": "Great things never come from comfort zones."},
    {"id": 4, "text": "Everyday is just a step in a marathon."}
]