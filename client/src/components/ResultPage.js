// ResultPage.js
import React from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Box,
  Link
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import autumnWarm from '../assets/autumn-warm.png';
import winterCool from '../assets/winter-cool.png';
import springWarm from '../assets/spring-warm.png';
import summerCool from '../assets/summer-cool.png';

function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { personalColorData, fashionItems, noBackground, responseText } = location.state || {};
  
  // item 과 url 가져오는 함수
  const recommendations = fashionItems.fashion_recommendations;

  
  // 퍼스널 컬러에 따라 텍스트 색상을 동적으로 변경하는 함수
  const getColorForPersonalColor = (personalColorData) => {
    switch (personalColorData) {
      case '봄 웜톤':
        return '#FFB74D';
      case '여름 쿨톤':
        return '#64B5F6';
      case '가을 웜톤':
        return '#A1887F';
      case '겨울 쿨톤':
        return '#7986CB';
      default:
        return '#333333';
    }
  };

  // 백엔드로부터 받은 데이터가 없을 경우 업로드 페이지로 리다이렉트
  React.useEffect(() => {
    if (!personalColorData || !fashionItems || !noBackground) {
      // navigate를 사용해서 다시 업로드 페이지로 보낼 수도 있음
      console.log('응답 없음')
      navigate('/');
    }
  }, [personalColorData, fashionItems, noBackground, navigate]);

  const handleBack = () => { // 뒤로가기
    navigate('/');
  };

  if (!personalColorData || !fashionItems || !noBackground) {
    return null; // 데이터가 없을 경우 렌더링하지 않음
  }

  // 퍼스널 컬러에 따른 색상표 이미지 설정
  const colorImageMap = {
    '가을 웜톤': autumnWarm,
    '겨울 쿨톤': winterCool,
    '봄 웜톤': springWarm,
    '여름 쿨톤': summerCool,
  };

  const colorImage = colorImageMap[personalColorData] || '';

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        분석 결과
      </Typography>
      <Card sx={{ padding: 4, backgroundColor: 'background.paper', boxShadow: 3 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h5" gutterBottom>
              업로드된 사진
            </Typography>
            {noBackground ? (
              <CardMedia
                component="img"
                height="300"
                image={noBackground}
                alt="Uploaded"
                sx={{ borderRadius: 2, boxShadow: 2 }}
              />
            ) : (
              <Typography variant="body1">사진이 없습니다.</Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h5" gutterBottom>
              당신의 퍼스널 컬러는
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: getColorForPersonalColor(personalColorData),
                fontWeight: 'bold',
              }}
            >
              {personalColorData}
            </Typography>
            {colorImage && (
              <Card sx={{ boxShadow: 3, borderRadius: 2, mt: 2 }}>
                <CardMedia
                  component="img"
                  image={colorImage}
                  alt={`${personalColorData} 색상표`}
                  sx={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </Card>
            )}
          </Grid>
        </Grid>

        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
        스타일링 추천
      </Typography>
      {responseText && (
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h6" align="center" sx={{ mt: 2 }}>
            {responseText} {/* 문자열 출력 */}
          </Typography>
        </Box>
)}

{/* 무신사 페이지와 링크 섹션 */}
<Box sx={{ mt: 4 }}>
<Grid container spacing={4}>
    {/* iframe 섹션 */}
    <Grid item xs={12} md={8}>
      <Typography variant="h5" gutterBottom>
        무신사 추천 페이지
      </Typography>
      <Box
        sx={{
          position: 'relative',
          height: '1000px', // 고정 높이 설정
          overflow: 'hidden', // 필요시 추가
        }}
      >
        <iframe
          src="https://www.musinsa.com/"
          title="Musinsa"
          name="recommendationFrame"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </Box>
    </Grid>

    {/* 링크 섹션 */}
    <Grid item xs={12} md={4}>
      <Typography variant="h5" gutterBottom>
        무신사 추천 아이템
      </Typography>
      {Object.keys(recommendations).map((category) => (
        <Box key={category} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {category}
          </Typography>
          <Box sx={{ mt: 1 }}>
            {recommendations[category].map((item, index) => (
              <Typography key={index} variant="body1" sx={{ mb: 1 }}>
                {/* 수정된 부분: target을 iframe으로 설정 */}
                <Link 
                  href={item.url} 
                  target="recommendationFrame" 
                  rel="noopener" 
                  underline="hover"
                >
                  {item.item}
                </Link>
              </Typography>
            ))}
          </Box>
        </Box>
      ))}
    </Grid>
  </Grid>
</Box>

      </Card>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            paddingY: 1.5,
            fontSize: '1rem',
            transition: 'background-color 0.3s, transform 0.2s',
            '&:hover': {
              backgroundColor: 'secondary.dark',
              transform: 'scale(1.05)',
            },
          }}
        >
          뒤로 가기
        </Button>
      </Box>
    </Container>
  );
}

export default ResultPage;