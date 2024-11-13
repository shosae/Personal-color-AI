# predict.py를 위한 서비스 파일
import torch
from torch import nn
from transformers import SegformerImageProcessor, SegformerForSemanticSegmentation
import numpy as np
from PIL import Image
import os
from core.env import env
import re
import requests
import json
from sklearn.cluster import DBSCAN
from collections import Counter
import logging

logger = logging.getLogger(__name__)
    
#무신사 URL 생성 함수(아이템과 생상이름을 조합하여 URL 생성)
def generate_musinsa_url(item, color_name):
    base_url = "https://www.musinsa.com/search/goods"
    return f"{base_url}?keyword={color_name} {item}&keywordType=keyword&gf=A"

# AI 응답 파싱 함수
def parse_ai_response(response_text):
    response_text = response_text.replace("*", "")
    # 설명 부분만 추출하기
    
    explanation_pattern = r"설명\s*:\s*(.+)"
    explanation_match = re.search(explanation_pattern, response_text)
    explanation = explanation_match.group(1) if explanation_match else "설명이 포함되어 있지 않습니다."
    
    
    # 퍼스널 컬러 추출
    if "봄" in response_text:
        personal_color = "봄 웜톤"
    elif "여름" in response_text:
        personal_color = "여름 쿨톤"
    elif "가을" in response_text:
        personal_color = "가을 웜톤"
    else:
        personal_color = "겨울 쿨톤"
    

    # 패턴으로 각 아이템 카테고리를 추출
    recommendations = {"상의": [], "하의": [], "악세서리": []}
    patterns = {
        "상의": r"상의\s*:\s*([^\n]+)",
        "하의": r"하의\s*:\s*([^\n]+)",
        "악세서리": r"악세서리\s*:\s*([^\n]+)"
    }

    for category, pattern in patterns.items():
        match = re.search(pattern, response_text)
        if match:
            items = match.group(1).split(", ")
            for item_with_color in items:
                color_name, item = extract_color_and_item(item_with_color)
                url = generate_musinsa_url(item, color_name)
                recommendations[category].append({
                    "item": f"{color_name} {item}",
                    "url": url
                })

    # 포맷 검증
    if not any(recommendations.values()) or personal_color == "알 수 없음":
        return None

    return personal_color, recommendations, explanation

# 색상과 아이템을 분리하는 함수
def extract_color_and_item(item_with_color):
    parts = item_with_color.split(" ", 1)
    color_name = parts[0] if len(parts) > 1 else "기본 색상"
    item = parts[1] if len(parts) > 1 else parts[0]
    return color_name, item



class PredictService:
    #def __init__(self):
    @staticmethod
    def dbscan_dominant_color(rgb_values, eps=10, min_samples=5):
        # RGB 값을 float 타입으로 변환
        rgb_values = rgb_values.astype(float)
        
        db = DBSCAN(eps=eps, min_samples=min_samples).fit(rgb_values)
        labels = db.labels_
        
        # 노이즈를 제외한 레이블 중에서 가장 큰 클러스터 찾기
        label_counts = Counter(label for label in labels if label != -1)
        if not label_counts:
            return np.mean(rgb_values, axis=0)  # 모든 포인트가 노이즈일 경우
        
        dominant_cluster = max(label_counts, key=label_counts.get)
        return np.mean(rgb_values[labels == dominant_cluster], axis=0)
        print(f"RGB Values Shape: {rgb_values.shape}")
        print(f"RGB Values: {rgb_values}")
        
    def get_rgb(self, model, image_processor, image):
        try:
            if image.mode != "RGB":
                image = image.convert("RGB")
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            inputs = image_processor(images=image, return_tensors="pt").to(device)
            outputs = model(**inputs)
            logits = outputs.logits 

            upsampled_logits = nn.functional.interpolate(
                logits,
                size=image.size[::-1],
                mode='bilinear',
                align_corners=False
            )
            labels = upsampled_logits.argmax(dim=1)[0]
            labels_viz = labels.cpu().numpy()
            image_np = np.array(image)

            skin_mask = labels_viz == 1
            hair_mask = labels_viz == 13
            eye_mask = np.logical_or.reduce((labels_viz == 3, labels_viz == 4, labels_viz == 5))

            skin_rgb = image_np[skin_mask]
            hair_rgb = image_np[hair_mask]
            eye_rgb = image_np[eye_mask]

            logger.info("Skin RGB values shape: %s", skin_rgb.shape)
            logger.info("Hair RGB values shape: %s", hair_rgb.shape)
            logger.info("Eye RGB values shape: %s", eye_rgb.shape)

            skin_avg_rgb = PredictService.dbscan_dominant_color(skin_rgb) if skin_rgb.size > 0 else np.array([0, 0, 0])
            hair_avg_rgb = PredictService.dbscan_dominant_color(hair_rgb) if hair_rgb.size > 0 else np.array([0, 0, 0])
            eye_avg_rgb = PredictService.dbscan_dominant_color(eye_rgb) if eye_rgb.size > 0 else np.array([0, 0, 0])

            logger.info("Final RGB Values - Skin: %s, Hair: %s, Eye: %s", skin_avg_rgb, hair_avg_rgb, eye_avg_rgb)

            return {
                "skin": skin_avg_rgb,
                "hair": hair_avg_rgb,
                "eye": eye_avg_rgb
            }
        except Exception as e:
            logger.error("Error in get_rgb: %s", str(e))
            raise
        
    def predict_personal_color(self, response, gender = None):
        API_URL = "https://api.x.ai/v1/chat/completions"
        API_KEY = env.get("API_KEY")

        skin_rgb = response["skin"]
        eye_rgb = response["eye"]
        hair_rgb = response["hair"]

        prompt = f"""
    다음 RGB 값이 주어졌습니다:
    - 피부색: {skin_rgb}
    - 눈 색상: {eye_rgb}
    - 머리카락 색상: {hair_rgb}

    사용자 정보:
     - 이 사람의 성별은 {gender}.
     
    이 정보를 바탕으로 해당 사람의 퍼스널 컬러 계절(봄 웜톤, 여름 쿨톤, 가을 웜톤, 겨울 쿨톤)을 결정하고, 이에 맞는 상의, 하의, 악세서리 아이템(색상 포함)을 추천해 주세요.
    추천은 아래 예시에 맞춰 작성해 주세요.

    당신은 퍼스널 컬러와 패션 추천 전문가입니다. 사용자의 퍼스널 컬러에 어울리는 상의, 하의, 액세서리의 색상과 구체적인 패션 아이템을 추천해 주세요. 
    패션 아이템을 추천할때 *성별*을 참고하여 추천하시오*
    각 항목에 대해, **"상의", "하의", "악세서리"** 카테고리별로 색상과 아이템을 다음 형식으로 정리해 주세요.
    **색상은 대중적인 색상**
**예시 출력 형식**:
- 퍼스널 컬러: 가을 웜톤
- 상의:  옐로우 니트 스웨터, 버건디 블라우스
- 하의: 카키 컬러 스트레이트 진, 레드 플레어 스커트
- 악세서리: 골드 체인 목걸이, 브론즈 색조 아이섀도, 그린 핸드백
- 설명: 색상을 고른 이유 설명

**실제 예시**:
- 퍼스널 컬러: 봄 웜톤
- 상의: 파스텔 핑크 셔츠,  블루 카디건
- 하의: 아이보리 슬랙스, 화이트 스커트
- 악세서리: 로즈 골드 귀걸이, 실버 체인 목걸이

- 설명: 색상을 고른 이유 설명

이 형식을 정확히 준수해 주세요. 각 카테고리는 한 줄로 간결하게 작성해 주세요.
    """

        headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {API_KEY}"
            }

        data = {
                "messages": [
                    {"role": "system", "content": "You are a personal color and fashion recommendation expert."},
                    {"role": "user", "content": prompt}
                ],
                "model": "grok-beta",
                "stream": False,
                "temperature": 0.7
            }
        
        response = requests.post(API_URL, headers=headers, data=json.dumps(data))
        
        
        if response.status_code == 200:
            result = response.json()
            response_text = result['choices'][0]['message']['content'].strip()
            #print(response_text)
            # AI 응답에서 퍼스널 컬러, 각 카테고리별 패션 추천 및 설명 추출
            parse_result = parse_ai_response(response_text)
            
            
            # 포맷 확인 및 재요청 로직
            if parse_result is None:
                print(response_text)
                print("AI 응답이 일관된 포맷을 따르지 않았습니다. 재요청을 고려하세요.")
                return {"error": "일관된 포맷이 아닙니다. AI의 응답을 다시 확인하십시오."}
            
            personal_color, fashion_recommendations, explanation = parse_result

            # JSON 응답 생성
            return {
                "personal_color": personal_color,
                "fashion_recommendations": fashion_recommendations,
                "response_text": explanation
            }
        else:
            return {"error": f"오류: {response.status_code}, {response.text}"}
