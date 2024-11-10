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
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewURL(base64String);
        localStorage.setItem('previewURL', base64String);
      };
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

    setLoading(true); // 로딩 시작

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('gender', gender);

    try {
      // 백엔드로 이미지와 성별 데이터를 전송
      const response = await axios.post('http://백엔드_서버_URL/api/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { personal_color, styling_recommendation } = response.data;
      localStorage.setItem('personalColor', personal_color);
      localStorage.setItem('stylingRecommendation', styling_recommendation);

      setLoading(false); // 로딩 종료
      navigate('/result'); // 결과 페이지로 이동
    } catch (error) {
      console.error('에러 발생:', error);
      alert('분석 요청 중 오류가 발생했습니다.');
      setLoading(false); // 로딩 종료
    }
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
              <FormControlLabel value="male" control={<Radio />} label="남자" />
              <FormControlLabel value="female" control={<Radio />} label="여자" />
            </RadioGroup>
          </FormControl>

          {/* 로딩 중일 때는 로딩 스피너 표시 */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ ml: 2 }}>
                분석 중입니다. 잠시만 기다려주세요...
              </Typography>
            </Box>
          ) : (
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
          )}
        </Box>
      </Card>
    </Container>
  );
}

export default UploadPage;
