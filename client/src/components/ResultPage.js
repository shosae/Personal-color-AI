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
  const { personalColor, stylingRecommendation, previewURL } = location.state || {};

  // 퍼스널 컬러에 따라 텍스트 색상을 동적으로 변경하는 함수
  const getColorForPersonalColor = (color) => {
    switch (color) {
      case 'Spring Warm':
        return '#FFB74D';
      case 'Summer Cool':
        return '#64B5F6';
      case 'Autumn Warm':
        return '#A1887F';
      case 'Winter Cool':
        return '#7986CB';
      default:
        return '#333333';
    }
  };

  // 백엔드로부터 받은 데이터가 없을 경우 업로드 페이지로 리다이렉트
  React.useEffect(() => {
    if (!personalColor || !stylingRecommendation || !previewURL) {
      navigate('/'); // 업로드 페이지로 이동
    }
  }, [personalColor, stylingRecommendation, previewURL, navigate]);

  const handleBack = () => { // 뒤로가기
    navigate('/');
  };

  if (!personalColor || !stylingRecommendation || !previewURL) {
    return null; // 데이터가 없을 경우 렌더링하지 않음
  }

  // 퍼스널 컬러에 따른 색상표 이미지 설정
  const colorImageMap = {
    'Autumn Warm': autumnWarm,
    'Winter Cool': winterCool,
    'Spring Warm': springWarm,
    'Summer Cool': summerCool,
  };

  const colorImage = colorImageMap[personalColor] || '';

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
            {previewURL ? (
              <CardMedia
                component="img"
                height="300"
                image={previewURL}
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
                color: getColorForPersonalColor(personalColor),
                fontWeight: 'bold',
              }}
            >
              {personalColor}
            </Typography>
            {colorImage && (
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  image={colorImage}
                  alt={`${personalColor} 색상표`}
                  sx={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </Card>
            )}
          </Grid>
        </Grid>

        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          스타일링 추천
        </Typography>
        {stylingRecommendation && stylingRecommendation.length > 0 && (
          <Box sx={{ mt: 4, mb: 4 }}>
            {stylingRecommendation.map((recommendation, index) => (
              <Typography key={index} variant="h6" align="center" sx={{ mt: 2 }}>
                {recommendation}
              </Typography>
            ))}
          </Box>
        )}

        {/* 스타일링 추천을 텍스트로 표시 */}
        {/* 만약 링크나 이미지라면 적절히 표시하도록 수정 */}
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
