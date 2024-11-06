from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import io

router = APIRouter()

@router.post("/")
async def upload_image(file: UploadFile = File(...)):
    # 업로드된 파일이 이미지인지 확인
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Only JPEG or PNG images are allowed.")
    
    try:
        # 이미지 파일을 메모리로 읽기
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))

        # 이미지 처리 로직 (예: 분석 등)
        width, height = image.size
        print(f"Image size: {width}x{height}")

        # 분석 결과 예시
        personal_color = "쿨톤 여름"
        fashion_items = ["파스텔 블루 셔츠", "화이트 팬츠", "실버 액세서리"]

        return JSONResponse(content={
            "personal_color": personal_color,
            "fashion_items": fashion_items
        })

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the image.")