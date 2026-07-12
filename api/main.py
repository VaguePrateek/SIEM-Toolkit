from fastapi import FastAPI
from api.routes import router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router

app = FastAPI(
    title="SIEM Toolkit API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app = FastAPI(
    title="SIEM Toolkit API",
    version="1.0.0",
    description="Machine Learning SIEM"
)

app.include_router(router)