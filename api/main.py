from fastapi import FastAPI

from api.routes import router

app = FastAPI(
    title="SIEM Toolkit API",
    version="1.0.0",
    description="Machine Learning SIEM"
)

app.include_router(router)