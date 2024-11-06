import requests
import json
import re

API_URL = "https://api.x.ai/v1/chat/completions"
API_KEY = "xai-K80PvsOrUsTYyHoRBfkJEszACAtw8B5peHHwWS4EM9YxMA2ZtrBhHUNhcMIB3TMyMKx69yZ8bqYk2z9w"

# 무신사 URL 생성 함수 (아이템과 색상 이름을 조합하여 URL 생성)
def generate_musinsa_url(item, color_name):
    base_url = "https://www.musinsa.com/search/goods"
    return f"{base_url}?keyword={color_name} {item}&keywordType=keyword&gf=A"

# AI 응답 파싱 함수
def parse_ai_response(response_text):
    response_text = response_text.replace("*", "")

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

    return personal_color, recommendations

# 색상과 아이템을 분리하는 함수
def extract_color_and_item(item_with_color):
    parts = item_with_color.split(" ", 1)
    color_name = parts[0] if len(parts) > 1 else "기본 색상"
    item = parts[1] if len(parts) > 1 else parts[0]
    return color_name, item


# 메인 함수
def get_personal_color_recommendation(skin_rgb, eye_rgb, hair_rgb):
    prompt = f"""
    다음 RGB 값이 주어졌습니다:
    - 피부색: {skin_rgb}
    - 눈 색상: {eye_rgb}
    - 머리카락 색상: {hair_rgb}

    이 정보를 바탕으로 해당 사람의 퍼스널 컬러 계절(봄 웜톤, 여름 쿨톤, 가을 웜톤, 겨울 쿨톤)을 결정하고, 이에 맞는 상의, 하의, 악세서리 아이템(색상 포함)을 추천해 주세요.
    추천은 아래 예시에 맞춰 작성해 주세요.

    당신은 퍼스널 컬러와 패션 추천 전문가입니다. 사용자의 퍼스널 컬러에 어울리는 상의, 하의, 액세서리의 색상과 구체적인 패션 아이템을 추천해 주세요. 각 항목에 대해, **"상의", "하의", "악세서리"** 카테고리별로 색상과 아이템을 다음 형식으로 정리해 주세요.
    **색상은 대중적인 색상**
**예시 출력 형식**:
- 퍼스널 컬러: 가을 웜톤
- 상의: 머스타드 옐로우 니트 스웨터, 버건디 블라우스
- 하의: 카키 컬러 스트레이트 진, 딥 와인 레드 플레어 스커트
- 악세서리: 골드 체인 목걸이, 브론즈 색조 아이섀도, 딥 그린 핸드백

**실제 예시**:
- 퍼스널 컬러: 봄 웜톤
- 상의: 파스텔 핑크 셔츠, 라이트 블루 카디건
- 하의: 아이보리 슬랙스, 화이트 스커트
- 악세서리: 로즈 골드 귀걸이, 실버 체인 목걸이

이 형식을 정확히 준수해 주세요. 각 카테고리는 한 줄로 간결하게 작성해 주세요.
    """

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    data = {
        "messages": [
            {"role": "system", "content": "당신은 퍼스널 컬러와 패션 추천 전문가입니다."},
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

        # AI 응답에서 퍼스널 컬러, 각 카테고리별 패션 추천 및 URL 추출
        parse_result = parse_ai_response(response_text)
        
        # 포맷 확인 및 재요청 로직
        if parse_result is None:
            print(response_text)
            print("AI 응답이 일관된 포맷을 따르지 않았습니다. 재요청을 고려하세요.")
            return {"error": "일관된 포맷이 아닙니다. AI의 응답을 다시 확인하십시오."}
        
        personal_color, fashion_recommendations = parse_result

        # JSON 응답 생성
        return {
            "personal_color": personal_color,
            "fashion_recommendations": fashion_recommendations,
            "response_text": response_text
        }
    else:
        return {"error": f"오류: {response.status_code}, {response.text}"}

# 예시 호출
skin_rgb = [220, 180, 150]  # 가을 웜톤 피부색
eye_rgb = [105, 70, 50]     # 가을 웜톤 눈 색상
hair_rgb = [120, 85, 60]    # 가을 웜톤 머리카락 색상

recommendation = get_personal_color_recommendation(skin_rgb, eye_rgb, hair_rgb)
print("패션 아이템 추천 (JSON 형태):")
print(json.dumps(recommendation, ensure_ascii=False, indent=2))