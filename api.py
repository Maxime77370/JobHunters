from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector

app = FastAPI()

# Configuration de la base de données
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "jobboard"
}

# Modèles de données Pydantic pour validation
class Advertisement(BaseModel):
    title: str
    description: str
    full_description: str
    wages: float
    location: str
    working_time: str
    company_id: int

class Company(BaseModel):
    name: str
    description: str

class User(BaseModel):
    username: str
    password: str
    email: str
    phone: str
    role: str

class JobApplication(BaseModel):
    user_id: int
    job_advertisement_id: int
    message: str

@app.post("/create_advertisement")
def create_advertisement(ad: Advertisement):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "INSERT INTO job_advertisements (title, description, full_description, wages, location, working_time, company_id) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        values = (ad.title, ad.description, ad.full_description, ad.wages, ad.location, ad.working_time, ad.company_id)
        cursor.execute(query, values)
        conn.commit()
        created_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return {"message": "Advertisement created successfully", "id": created_id}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

@app.get("/get_advertisement/{ad_id}")
def get_advertisement(ad_id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM job_advertisements WHERE id = %s"
        cursor.execute(query, (ad_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        if result:
            return result
        else:
            raise HTTPException(status_code=404, detail="Advertisement not found")
    except Exception as e:
        return {"message": f"Error: {str(e)}"}
