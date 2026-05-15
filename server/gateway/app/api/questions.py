import os

import httpx
from fastapi import APIRouter, HTTPException

questions_router = APIRouter(prefix="/api/questions", tags=["questions"])

QUESTIONS_SERVICE_URL = os.getenv(
    "QUESTIONS_SERVICE_URL",
    "http://questions-service:8000"
)

@questions_router.get("/topics")
async def get_questions_topics():
    async with httpx.AsyncClient(timeout=5) as client:
        response = await client.get(f"{QUESTIONS_SERVICE_URL}/topics")
    if response.is_error:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()

@questions_router.get("/{question_set_id}")
async def get_question_set_topics(question_set_id: str):
    async with httpx.AsyncClient(timeout=5) as client:
        response = await client.get(f"{QUESTIONS_SERVICE_URL}/{question_set_id}")
    if response.is_error:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()
