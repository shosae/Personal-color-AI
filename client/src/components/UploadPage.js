// src/components/UploadPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  Card,
  Grid,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // 설치된 패키지에서 아이콘 불러오기
function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [gender, setGender] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // 파일을 Base64로 인코딩하여 미리보기 URL로 사용
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreviewURL(base64String);
      localStorage.setItem('previewURL', base64String);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }
    if (!gender) {
      alert('성별을 선택해주세요.');
      return;
    }

    // 백엔드 연결 (주석 해제 후 사용)
    /*
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('gender', gender);

    try {
      const response = await axios.post('http://백엔드_URL/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { personal_color } = response.data;
      localStorage.setItem('personalColor', personal_color);

      navigate('/result');
    } catch (error) {
      console.error('에러 발생:', error);
      alert('분석 요청 중 오류가 발생했습니다.');
    }
    */

    // 임시 퍼스널컬러 설정
    localStorage.setItem('personalColor', 'Winter Cool');

    // 결과 페이지로 이동
    navigate('/result');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        퍼컬 AI
      </Typography>
      <Card sx={{ padding: 4, backgroundColor: 'background.paper' }}>
        <Typography variant="h5" gutterBottom>
          사진을 업로드하고 분석하세요
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'primary.light',
              },
            }}
          >
            사진 선택
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {selectedFile && (
            <Box>
              <Typography variant="body1" gutterBottom>
                선택된 파일: {selectedFile.name}
              </Typography>
              {previewURL && (
                <Box
                  component="img"
                  src={previewURL}
                  alt="Preview"
                  sx={{
                    width: '100%',
                    maxHeight: 300,
                    objectFit: 'cover',
                    mt: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                />
              )}
            </Box>
          )}

          <FormControl component="fieldset">
            <FormLabel component="legend">성별 선택</FormLabel>
            <RadioGroup row value={gender} onChange={handleGenderChange}>
              <FormControlLabel
                value="male"
                control={<Radio />}
                label="남자"
                aria-label="남성"
              />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="여자"
                aria-label="여성"
              />
            </RadioGroup>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            sx={{
              mt: 2,
              paddingY: 1.5,
              fontSize: '1rem',
              transition: 'background-color 0.3s, transform 0.2s',
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'scale(1.05)',
              },
            }}
          >
            사진 업로드 및 분석
          </Button>
        </Box>
      </Card>
    </Container>
  );
}

export default UploadPage;
