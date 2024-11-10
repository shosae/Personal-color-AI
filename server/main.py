from fastapi import FastAPI
from api import predict  # image.py 모듈 임포트
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 앱이 실행되는 주소
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

# api/image.py의 라우터 등록
app.include_router(predict.router, prefix="/api")


# 기본 엔드포인트
@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI server!"}

# 서버 실행
# uvicorn main:app --reload 

