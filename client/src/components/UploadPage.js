// UploadPage.js
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
  Snackbar,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null); // 사진 선택
  const [previewURL, setPreviewURL] = useState(null); // 미리보기 URL
  const [gender, setGender] = useState(''); // 성별 선택
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(''); // 에러 메시지 상태
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar 상태
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']; // 파일 타입 검증
      if (!validTypes.includes(file.type)) {
        setError('지원되지 않는 파일 형식입니다. JPEG, PNG, GIF 파일만 업로드할 수 있습니다.');
        setOpenSnackbar(true);
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) { // 파일 크기 검증
        setError('파일 크기가 너무 큽니다. 5MB 이하의 파일을 업로드해주세요.');
        setOpenSnackbar(true);
        return;
      }
      setSelectedFile(file);
      const objectURL = URL.createObjectURL(file);
      setPreviewURL(objectURL);
    }
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('사진을 선택해주세요.');
      setOpenSnackbar(true);
      return;
    }
    if (!gender) {
      setError('성별을 선택해주세요.');
      setOpenSnackbar(true);
      return;
    }

    setLoading(true); // 로딩 시작

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('gender', gender);

    try {
      // 백엔드로 이미지와 성별 데이터를 전송, URL 다를 시 변경 필요!
      const response = await axios.post('http://127.0.0.1:8000/api/predict', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { personal_color, styling_recommendation, preview_url } = response.data;
      
      // navigate를 통해 상태 전달
      navigate('/result', { state: { personalColor: personal_color, stylingRecommendation: styling_recommendation, previewURL: preview_url } });

      setLoading(false); // 로딩 종료
    } catch (error) { // 에러 발생 시
      console.error('에러 발생:', error);
      setError('분석 요청 중 오류가 발생했습니다.');
      setOpenSnackbar(true);
      setLoading(false); // 로딩 종료
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Personal Color AI
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

          {/* 응답 대기 */}
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

      {/* Snackbar for error messages */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default UploadPage;
