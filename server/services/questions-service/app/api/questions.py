from fastapi import APIRouter
questions_router = APIRouter(tags=["questions"])

@questions_router.get("/topics")
async def get_questions_topics():
    return {
        "id": "id",
        "something_else": "something_else"
    }

@questions_router.get("/{question_set_id}")
async def get_question_set_topics(question_set_id: str):
    return {
        "question_id": question_set_id,
        "something_else": "something_else"

    }
