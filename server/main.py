from fastapi import FastAPI
from api import predict  # image.py 모듈 임포트
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


app = FastAPI()

origins = [
    "http://localhost:8080",  # 개발 환경
    "http://192.168.1.101:8080",  # 네트워크 환경에서 React 앱 URL
    "http://localhost:3000",
    "http://192.168.1.101"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # React 앱이 실행되는 주소
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

app.mount("/", StaticFiles(directory="static", html=True), name="static")

# 서버 실행
# uvicorn main:app --reload 

