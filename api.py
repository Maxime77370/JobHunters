from pydantic import BaseModel, constr
import mysql.connector
from fastapi import FastAPI, HTTPException, Depends, Cookie, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(debug=True)

# Configuration de hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Configuration de la base de données
db_config = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "",
    "database": "jobboard"
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://jobboard"],
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

class UserCookieInfo(BaseModel):
    username: str
    password: str
    role: str

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
# on utilise du regex coté serveur pour empecher les injections sql/ xss
class UserRegister(BaseModel):
    username: str
    password: str
    email: str
    phone: str
    role: str

# Modèle de données Pydantic pour un jeton JWT (contenant des informations de l'utilisateur)
class Token(BaseModel):
    user_data: str
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


# Fonction pour créer un nouvel utilisateur dans la base de données sans mot de passe haché
@app.post("/users", response_model=User)
def create_user(user: User):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "INSERT INTO users (username, password, email, phone, role) VALUES (%s, %s, %s, %s, %s)"
        values = (user.username, user.password, user.email, user.phone, user.role)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# fonction pour créer un nouvel utilisateur dans la base de données avec un mot de passe haché
@app.post("/register", response_model=User)
def register(user: UserRegister):
    try:
        hashed_password = pwd_context.hash(user.password)
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "INSERT INTO users (username, password, email, phone, role) VALUES (%s, %s, %s, %s, %s)"
        values = (user.username, hashed_password, user.email, user.phone, user.role)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


#route pour obtenir tous les utilisateurs
@app.get("/users", response_model=list[User])
def get_all_users():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT username, email, phone, role FROM users"
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

 #route pour obtenir un utilisateur par son id
@app.get("/users/{user_id}", response_model=User)
def get_user_by_id(user_id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT username, password, email, phone, role FROM users WHERE id = %s"
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        if result:
            return result
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")




# Génération du jeton JWT
def generate_token(data: dict):
    to_encode = data.copy()
    expires = datetime.utcnow() + timedelta(minutes=30)  # Ajoutez votre propre durée d'expiration
    to_encode.update({"exp": expires})
    encoded_jwt = jwt.encode(to_encode, "0000", algorithm="HS256")  # Remplacez "YOUR_SECRET_KEY" par votre propre clé secrète
    return encoded_jwt


# Route de connexion avec vérification des informations d'identification
@app.post("/login")
async def login(user: UserLogin):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT id, username, password, email, phone, role FROM users WHERE username = %s"
        cursor.execute(query, (user.username,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        if result:
            if pwd_context.verify(user.password, result["password"]):
                user_data = {"username": result["username"], "role": result["role"], "id": result["id"], "email": result["email"], "phone": result["phone"]}
                token = generate_token(user_data)
                return {"token": token, "user_data": user_data}
            else:
                raise HTTPException(status_code=401, detail="Invalid credentials")
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


#route pour se déconnecter
@app.get("/logout")
def logout():
    response = JSONResponse({"message": "Logout successful"})
    response.delete_cookie(key="user_data")
    return response

#route pour mettre à jour un utilisateur par son id

@app.put("/users/{user_id}", response_model=User)
def update_user(user_id: int, user: User):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "UPDATE users SET username = %s, password = %s, email = %s, phone = %s, role = %s WHERE id = %s"
        values = (user.username, user.password, user.email, user.phone, user.role, user_id)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    
    #route pour supprimer un utilisateur par son id
@app.delete("/users/{user_id}", response_model=dict)
def delete_user(user_id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "DELETE FROM users WHERE id = %s"
        cursor.execute(query, (user_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "User deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

