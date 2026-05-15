import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.questions import questions_router

app = FastAPI(title="Speaking Trainer API Gateway")

client_origin = os.getenv("CLIENT_ORIGIN", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[client_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(questions_router)

@app.get("/health")
async def health_check():
    return {
        "ok": True,
        "service": "api-gateway"
    }

@app.get("/api/status")
async def status():
    return {
        "ready": True,
        "message": "API Gateway is ready"
    }
