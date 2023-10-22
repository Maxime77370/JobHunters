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

tags_metadata = [
    {
        "name": "Authentification",
        "description": "Toutes les opérations liées à l'authentification."
    },
    {
        "name": "Users",
        "description": "Gérer les utilisateurs."
    },
    {
        "name": "Companies",
        "description": "Opérations liées aux entreprises."
    },
    {
        "name": "Job Advertisements",
        "description": "Opérations liées aux annonces d'emploi."
    },
    {
        "name": "Job Applications",
        "description": "Opérations liées aux candidatures."
    },
    {
        "name": "Generic Operations",
        "description": "Opérations génériques pour obtenir et supprimer des données."
    },
]

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI(openapi_tags=tags_metadata)

# Configuration de hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Génération du jeton JWT
def generate_token(data: dict):
    to_encode = data.copy()
    expires = datetime.utcnow() + timedelta(minutes=30)  # Ajoutez votre propre durée d'expiration
    to_encode.update({"exp": expires})
    encoded_jwt = jwt.encode(to_encode, "0000", algorithm="HS256")  # Remplacez "YOUR_SECRET_KEY" par votre propre clé secrète
    return encoded_jwt

# Vérification du jeton JWT
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        user_data = jwt.decode(token, "0000", algorithms=["HS256"])
        return user_data
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

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

@app.post("/create_job_advertisements", tags=["Job Advertisements"])
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

@app.post("/create_companies", tags=["Companies"])
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
    
@app.post("/create_users", tags=["Users"], response_model=User)
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
    
@app.post("/create_job_applications", tags=["Job Applications"])
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
 
@app.post("/modify_companies/{id}", tags=["Companies"])
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
    
@app.get("/get_company_owned/{id_owner}", tags=["Companies"])
def get_company_owned(id_owner: str):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT id FROM companies WHERE owner_id =  " + id_owner
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
    
@app.get("/get_company_id_job", tags=["Companies"])
def get_id_table():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT company_id FROM job_advertisements"
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
    
@app.get("/get_id_by_advertisement/{job_id}", tags=["Job Applications"])
def get_id_table_by_user(job_id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        # Assurez-vous que le nom de la colonne est 'user_id' dans la table souhaitée.
        query = f"SELECT id FROM job_applications WHERE job_advertisement_id = {job_id}"
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        conn.close()

        if result:
            return result
        else:
            raise HTTPException(status_code=404, detail="Advertisements not found for the given user_id")
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

@app.get("/get_id_by_company/{id_company}", tags=["Companies"])
def get_id_by_company(id_company: str):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        query = "SELECT id FROM job_advertisements WHERE company_id =  " + id_company
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

@app.post("/modify_users/{id}", tags=["Users"])
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
 
@app.delete("/delete/{table}/{id}", tags=["Generic Operations"])
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

@app.get("/get_table/{table}/{id}", tags=["Generic Operations"])
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

@app.get("/get_id_table/{table}", tags=["Generic Operations"])
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

@app.get("/get_id_table_by_user/{table}/{user_id}", tags=["Job Applications"])
def get_id_table_by_user(table: str, user_id: int):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        # Assurez-vous que le nom de la colonne est 'user_id' dans la table souhaitée.
        query = f"SELECT id FROM {table} WHERE user_id = {user_id}"
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        
        if result:
            return result
        else:
            raise HTTPException(status_code=404, detail="Advertisements not found for the given user_id")
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

@app.get("/get_key_table/{table}", tags=["Generic Operations"])
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
@app.post("/login", tags=["Authentification"])
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
@app.post("/logout", tags=["Authentification"])
async def logout():
    return {"message": "Successfully logged out"}

# Route pour vérifier un mot de passe
@app.post("/verify-pwd", tags=["Authentification"])
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

@app.post("/apply_for_job", tags=["Job Applications"])
def apply_for_job(job_application: JobApplication, user_data: dict = Depends(get_current_user)):
    try:
        user_id = user_data.get("id")
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        query = "INSERT INTO job_applications (user_id, job_advertisement_id, message) VALUES (%s, %s, %s)"
        values = (user_id, job_application.job_advertisement_id, job_application.message)
        cursor.execute(query, values)
        conn.commit()
        created_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return {"message": "Job application created successfully", "id": created_id}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}