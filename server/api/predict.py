from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import io
import base64
from io import BytesIO
from service.predict import PredictService

import torch
from torch import nn
from transformers import SegformerImageProcessor, SegformerForSemanticSegmentation
import numpy as np
from rembg import remove

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

        # 이미치 피부, 눈, 머리 부분 추출 및 RGB 값 추출
        response = predictService.get_rgb(model, image_processor, image)
        rgb_response = {k: v.tolist() for k, v in response.items()}

        '''
        rgb_response 결과 예시
    {
        "skin": [
        235.83298538622128,
        198.34812108559498,
        197.77348643006263
        ],
        "hair": [
        78.79415868291322,
        64.02846246860757,
        65.20844572597898
        ],
        "eye": [
        126.39473684210526,
        94.42105263157895,
        97.92105263157895
        ]
    }
        '''

        # gpt에게 퍼스널 컬러 분석 요청
        gptresult = predictService.predict_personal_color(rgb_response)

        # 사진에서 배경을 제거
        no_background = remove(image)

        # 이미지 저장
        no_background.save("output.png")

        # 이미지를 base64로 인코딩
        buffered = BytesIO()
        no_background.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        

        return JSONResponse(content={
            "personal_color": rgb_response,
            "fashion_items": gptresult,
            "no_background": f"data:image/png;base64,{img_str}"
        })

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing the image.")