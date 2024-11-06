# predict.py를 위한 서비스 파일
import torch
from torch import nn
from transformers import SegformerImageProcessor, SegformerForSemanticSegmentation
import numpy as np
from PIL import Image


from fastapi import HTTPException
from typing import Optional, List, Set


class PredictService:
    def get_rgb(self, model, image_processor, image):

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
        inputs = image_processor(images=image, return_tensors="pt").to(device)
        outputs = model(**inputs)
        logits = outputs.logits 

        upsampled_logits = nn.functional.interpolate(logits,
                size=image.size[::-1], # H x W
                mode='bilinear',
                align_corners=False)

        labels = upsampled_logits.argmax(dim=1)[0]

        labels_viz = labels.cpu().numpy()
        image_np = np.array(image)

        # 마스크 생성
        skin_mask = labels_viz == 1
        hair_mask = labels_viz == 13
        eye_mask = np.logical_or.reduce((labels_viz == 3, labels_viz == 4, labels_viz == 5))

        # RGB 값 추출
        skin_rgb = image_np[skin_mask]
        hair_rgb = image_np[hair_mask]
        eye_rgb = image_np[eye_mask]

        # 평균 RGB 값 계산 시 빈 배열 처리
        def safe_mean(arr):
            return np.mean(arr, axis=0) if arr.size > 0 else np.array([0, 0, 0])

        skin_avg_rgb = safe_mean(skin_rgb)
        hair_avg_rgb = safe_mean(hair_rgb)
        eye_avg_rgb = safe_mean(eye_rgb)

        return { 
            "skin": skin_avg_rgb, 
            "hair": hair_avg_rgb, 
            "eye": eye_avg_rgb 
            }
