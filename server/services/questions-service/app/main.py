from fastapi import FastAPI
from app.api.questions import questions_router

app = FastAPI()

app.include_router(questions_router)

@app.get("/health")
async def health_check():
    return {"ok": True, "service": "questions-service"}
