from pydantic import BaseModel
import mysql.connector
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta


app = FastAPI(debug=True)

# Configuration de la base de données
db_config = {
    "host": "127.0.0.1",
    "port": "8889",
    "user": "root",
    "password": "root",
    "database": "jobboard"
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8888"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    # Modèle Pydantic pour validation des informations de connexion
class UserLogin(BaseModel):
    username: str
    password: str

# Modèle Pydantic pour validation des informations de l'utilisateur lors de l'inscription
class UserRegister(BaseModel):
    username: str
    password: str
    email: str
    phone: str
    role: str

# Modèle de données Pydantic pour un jeton JWT (contenant des informations de l'utilisateur)
class Token(BaseModel):
    access_token: str
    token_type: str


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

@app.get("/get_id_advertisements/{table}")
def get_id_advertisements(table: str):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT id FROM " + table
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        if result:
            return result
        else:
            raise HTTPException(status_code=404, detail="Advertisements not found")
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

# Configuration de hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Clé secrète pour JWT 
SECRET_KEY = "118181013"
ALGORITHM = "HS256"

# Durée de validité du jeton JWT (30 minutes dans cet exemple)
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# Fonction pour créer un jeton JWT
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return Token(access_token=encoded_jwt, token_type="bearer")


# Fonction pour créer un nouvel utilisateur dans la base de données
def create_user_in_db(user: UserRegister):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "INSERT INTO users (username, password, email, phone, role) VALUES (%s, %s, %s, %s, %s)"
        values = (user.username, user.password, user.email, user.phone, user.role)
        cursor.execute(query, values)
        conn.commit()
        created_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return created_id
    except Exception as e:
        return None  # Gérer l'erreur ici

# Fonction pour obtenir l'ID d'un utilisateur à partir de son nom d'utilisateur
def get_user_id_from_db(username: str):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "SELECT id FROM users WHERE username = %s"
        cursor.execute(query, (username,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        if result:
            return result[0]
        return None
    except Exception as e:
        return None  # Gérer l'erreur ici

# Fonction pour obtenir le rôle d'un utilisateur à partir de son nom d'utilisateur
def get_user_role_from_db(username: str):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "SELECT role FROM users WHERE username = %s"
        cursor.execute(query, (username,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        if result:
            return result[0]
        return None
    except Exception as e:
        return None  # Gérer l'erreur ici


# Route pour l'inscription d'un utilisateur
@app.post("/register", response_model=Token)
async def register_user(user: UserRegister):
    user_id = create_user_in_db(user)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user_id, "role": user.role},
        expires_delta=access_token_expires
    )
    return access_token

# Route pour la connexion d'un utilisateur
@app.post("/login", response_model=Token)
async def login_for_access_token(user: UserLogin):
    user_id = get_user_id_from_db(user.username)
    user_role = get_user_role_from_db(user.username)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user_id, "role": user_role},
        expires_delta=access_token_expires
    )
    return access_token