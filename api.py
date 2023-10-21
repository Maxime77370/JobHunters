from pydantic import BaseModel
import mysql.connector
from enum import Enum
from fastapi import FastAPI, Security, HTTPException, Depends, Cookie, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, SecurityScopes, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI(debug=True)

# Configuration de hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Génération du jeton JWT
def generate_token(data: dict):
    to_encode = data.copy()
    expires = datetime.utcnow() + timedelta(minutes=30)  # Ajoutez votre propre durée d'expiration
    to_encode.update({"exp": expires})
    encoded_jwt = jwt.encode(to_encode, "0000", algorithm="HS256")  # Remplacez "YOUR_SECRET_KEY" par votre propre clé secrète
    return encoded_jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

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

class UserCookieInfo(BaseModel):
    username: str
    password: str
    role: str

class JobApplication(BaseModel):
    user_id: int
    job_advertisement_id: int
    message: str

class User(BaseModel):
    username: str
    password: str
    email: str
    phone: str
    role: str

class UserRole(str, Enum):
    admin = "admin"
    entreprise = "entreprise"
    particulier = "particulier"

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
    user_data: str
    token_type: str

@app.post("/create_job_advertisements")
def create_job_advertisements(job_advertisement: Advertisement):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "INSERT INTO job_advertisements (title, description, full_description, wages, location, working_time, company_id) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        values = (job_advertisement.title, job_advertisement.description, job_advertisement.full_description, job_advertisement.wages, job_advertisement.location, job_advertisement.working_time, job_advertisement.company_id)
        cursor.execute(query, values)
        conn.commit()
        created_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return {"message": "Advertisement created successfully", "id": created_id}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

@app.post("/create_companies")
def create_companies(company: Company):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "INSERT INTO companies (name, description) VALUES (%s, %s)"
        values = (company.name, company.description)
        cursor.execute(query, values)
        conn.commit()
        created_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return {"message": "Company created successfully", "id": created_id}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}
    
@app.post("/create_users", response_model=User)
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
    
@app.post("/create_job_applications")
def create_job_applications(job_application: JobApplication):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "INSERT INTO job_applications (user_id, job_advertisement_id, message) VALUES (%s, %s, %s)"
        values = (job_application.user_id, job_application.job_advertisement_id, job_application.message)
        cursor.execute(query, values)
        conn.commit()
        created_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return {"message": "Job application created successfully", "id": created_id}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

@app.post("/modify_job_advertisements/{id}")
def modify_job_advertisements(job_advertisement: Advertisement, id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "UPDATE job_advertisements SET title = %s, description = %s, full_description = %s, wages = %s, location = %s, working_time = %s, company_id = %s WHERE id = " + str(id)
        values = (job_advertisement.title, job_advertisement.description, job_advertisement.full_description, job_advertisement.wages, job_advertisement.location, job_advertisement.working_time, job_advertisement.company_id)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Advertisement modified successfully"}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}
    
@app.post("/modify_companies/{id}")
def modify_companies(company: Company, id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "UPDATE companies SET name = %s, description = %s WHERE id = " + str(id)
        values = (company.name, company.description)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Company modified successfully"}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}
    
@app.post("/modify_users/{id}")
def modify_users(user: User, id: int):
    try:
        hashed_password = pwd_context.hash(user.password)
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "UPDATE users SET username = %s, password = %s, email = %s, phone = %s, role = %s WHERE id = " + str(id)
        values = (user.username, hashed_password, user.email, user.phone, user.role)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "User modified successfully"}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}
    
@app.post("/modify_job_applications/{id}")
def modify_job_applications(job_application: JobApplication, id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "UPDATE job_applications SET user_id = %s, job_advertisement_id = %s, message = %s WHERE id = " + str(id)
        values = (job_application.user_id, job_application.job_advertisement_id, job_application.message)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": "Job application modified successfully"}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}
    
@app.delete("/delete/{table}/{id}")
def delete(table: str, id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = f"DELETE FROM {table} WHERE id = %s"
        
        values = (id,)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return {"message": f"Row {id} deleted successfully from table {table}"}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

@app.get("/get_table/{table}/{id}")
def get_table(table: str, id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM " + table + " WHERE id = " + str(id)
        cursor.execute(query)
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        if result:
            return result
        else:
            raise HTTPException(status_code=404, detail="Advertisement not found")
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

@app.get("/get_id_table/{table}")
def get_id_table(table: str):
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

@app.get("/get_key_table/{table}")
def get_key_table(table: str):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "DESCRIBE " + table
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

# Route pour se déconnecter et supprimer le token du Local Storage
@app.post("/logout")
async def logout():
    return {"message": "Successfully logged out"}

# Route pour vérifier un mot de passe
@app.post("/verify-pwd")
async def verify_password(user: UserLogin):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT password FROM users WHERE username = %s"
        cursor.execute(query, (user.username,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        if result:
            stored_password = result["password"]
            if pwd_context.verify(user.password, stored_password):
                return {"message": "Mot de passe valide"}
            else:
                raise HTTPException(status_code=401, detail="Mot de passe incorrect")
        else:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

# vérifier si quelqu'un est d'une entreprise
def is_entreprise(token: str = Security(oauth2_scheme, scopes=["entreprise"])):
    user_data = generate_token(token)
    if user_data and user_data.get("role") == "entreprise":
        return True
    return False

# vérifier si quelqu'un est un "admin"
def is_admin(token: str = Depends(oauth2_scheme)):
    user_data = generate_token(token)
    if user_data and user_data.get("role") == "admin":
        return True
    return False

# route pour permette au role entreprise d'accèder à la page des annonces d'emploi job_ads.html
@app.get("/job_ads")
def job_ads_page(is_entreprise: bool = Depends(is_entreprise)):
    if is_entreprise:
        return {"message": "Bienvenue sur la page des annonces d'emploi pour les entreprises"}
    else:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
# route pour permette au role admin d'accèder à la page admin.html
@app.get("/admin")
def admin_page(is_admin: bool = Depends(is_admin)):
    if is_admin:
        return {"message": "Bienvenue sur la page admin"}
    else:
        raise HTTPException(status_code=403, detail="Accès refusé")
