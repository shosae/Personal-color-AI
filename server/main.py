from fastapi import FastAPI
from api import predict  # image.py 모듈 임포트

app = FastAPI()

# api/image.py의 라우터 등록
app.include_router(predict.router, prefix="/api")

# 기본 엔드포인트
@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI server!"}

# 서버 실행
# uvicorn main:app --reload 

