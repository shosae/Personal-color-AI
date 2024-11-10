// src/components/ResultPage.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // 설치된 패키지에서 아이콘 불러오기
import autumnWarm from '../assets/autumn-warm.png';
import winterCool from '../assets/winter-cool.png';
import springWarm from '../assets/spring-warm.png';
import summerCool from '../assets/summer-cool.png';
function ResultPage() {
  const [personalColor, setPersonalColor] = useState('');
  const [uploadedImage, setUploadedImage] = useState('');
  const [colorImage, setColorImage] = useState('');
  const [stylingRecommendation, setStylingRecommendation] = useState('');


  const navigate = useNavigate();

  useEffect(() => {
    const previewURL = localStorage.getItem('previewURL');
    const color = localStorage.getItem('personalColor');
    const recommendation = localStorage.getItem('stylingRecommendation');

    setUploadedImage(previewURL);
    setPersonalColor(color);
    setStylingRecommendation(recommendation);

     // 퍼스널 컬러에 따라서 색상표 이미지 설정
     switch (color) {
      case 'Autumn Warm':
        setColorImage(autumnWarm);
        break;
      case 'Winter Cool':
        setColorImage(winterCool);
        break;
      case 'Spring Warm':
        setColorImage(springWarm);
        break;
      case 'Summer Cool':
        setColorImage(summerCool);
        break;
      default:
        setColorImage('');
        break;
      }
  }, []);

  // 무신사 추천 URL 설정
  const colorCodes = {
    'Spring Warm': '5%2C9%2C12%2C23%2C29%2C31%2C32%2C44%2C45%2C56%2C77',
    'Summer Cool': '3%2C7%2C24%2C32%2C37%2C39%2C45%2C48%2C57%2C58',
    'Autumn Warm': '4%2C12%2C26%2C28%2C30%2C34%2C35%2C49%2C78%2C83%2C84',
    'Winter Cool': '1%2C2%2C11%2C13%2C25%2C36%2C49%2C51%2C59%2C60%2C73%2C80%2C81',
  };

  const colorFilter = colorCodes[personalColor] || '1'; // 기본 색상 설정

  const topRecommendationURL = `https://www.musinsa.com/category/001?gf=A&color=${colorFilter}`;
  const bottomRecommendationURL = `https://www.musinsa.com/category/003?gf=A&color=${colorFilter}`;

  const handleBack = () => {
    navigate('/');
  };

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
            {uploadedImage ? (
              <CardMedia
                component="img"
                height="300"
                image={uploadedImage}
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
            <Typography variant="h4" color="primary.main">
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
          퍼스널 컬러에 맞는 패션 아이템 추천
        </Typography>
        {stylingRecommendation && (
          <Typography variant="h6" align="center" sx={{ mt: 4, mb: 4 }}>
            {stylingRecommendation}
          </Typography>
        )}
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', padding: 2, boxShadow: 2 }}>
              <Typography variant="h6" gutterBottom>
                상의 추천
              </Typography>
              <Box
                component="iframe"
                title="Top Recommendation"
                src={topRecommendationURL}
                sx={{
                  width: '100%',
                  height: '1000px',
                  border: 'none',
                  borderRadius: 2,
                  mt: 2,
                }}
                loading="lazy"
              ></Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', padding: 2, boxShadow: 2 }}>
              <Typography variant="h6" gutterBottom>
                하의 추천
              </Typography>
              <Box
                component="iframe"
                title="Bottom Recommendation"
                src={bottomRecommendationURL}
                sx={{
                  width: '100%',
                  height: '1000px',
                  border: 'none',
                  borderRadius: 2,
                  mt: 2,
                }}
                loading="lazy"
              ></Box>
            </Card>
          </Grid>
        </Grid>

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
      </Card>
    </Container>
  );
}

export default ResultPage;
