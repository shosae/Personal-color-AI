// src/theme.js
import { createTheme } from '@mui/material/styles';
import '@fontsource/roboto/400.css'; // 설치된 폰트 불러오기
import '@fontsource/open-sans/600.css'; // 설치된 폰트 불러오기

const theme = createTheme({
  palette: {
    primary: {
      main: '#6C63FF', // 부드러운 퍼플 색상
    },
    secondary: {
      main: '#FF6584', // 부드러운 핑크 색상
    },
    background: {
      default: '#F5F5F5', // 밝은 회색 배경
      paper: '#FFFFFF', // 흰색 카드 배경
    },
    text: {
      primary: '#333333', // 진한 회색 텍스트
      secondary: '#555555', // 중간 회색 텍스트
    },
  },
  typography: {
    fontFamily: 'Roboto, Open Sans, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#6C63FF',
      marginBottom: '1.5rem',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#333333',
      marginBottom: '1rem',
    },
    body1: {
      color: '#555555',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '30px', // 모서리 둥글게
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px', // 모서리 둥글게
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.15)', // 그림자
        },
      },
    },
  },
});

export default theme;
