# JobHunters

JobHunters is a project similar to Indeed, used to apply for jobs and create companies and job advertisements


## Languages

This website is built with Javascript, Python, CSS and HTML. No PHP is required. No framework as well 😎


## SQL 

Use the "jobboard.sql" file and change it as you wish

## Installation

Use the "requirements.txt file"  to install packages. Once this is made, run the api in your website folder using uvicorn api:app --reload

```bash
pip install -r requirements.txt
```

## Database Usage

```python
db_config = {
    "host": "hostname",
    "user": "db_user",
    "password": "db_pwd",
    "database": "db_name"
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://your_hostname"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```


## Contributing

Made with love by Benjamin, Maxime and Edwin
