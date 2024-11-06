from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import io
from service.predict import PredictService

import torch
from torch import nn
from transformers import SegformerImageProcessor, SegformerForSemanticSegmentation
import numpy as np

router = APIRouter(
    prefix="/predict",
    tags=["predict"],
    responses={404: {"description": "Not found"}},
)

predictService = PredictService()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

image_processor = SegformerImageProcessor.from_pretrained("jonathandinu/face-parsing")
model = SegformerForSemanticSegmentation.from_pretrained("jonathandinu/face-parsing")
model.to(device)

@router.post("/")
async def upload_image(file: UploadFile = File(...)):
    # 업로드된 파일이 이미지인지 확인
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Only JPEG or PNG images are allowed.")
    
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

        response = predictService.get_rgb(model, image_processor, image)

        response = {k: v.tolist() for k, v in response.items()}

        # 분석 결과 예시
        personal_color = "쿨톤 여름"
        fashion_items = ["파스텔 블루 셔츠", "화이트 팬츠", "실버 액세서리"]

        return JSONResponse(content={
            "personal_color": response,
            "fashion_items": fashion_items
        })

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the image.")