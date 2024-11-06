import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    // 주석으로 백엔드 통신 제거, 임시 데이터 전송
    /*
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/api/predict', formData);
      const personalColor = response.data.personal_color;
      const fashionItems = response.data.fashion_items;

      // 결과 데이터 로컬 저장소에 저장
      localStorage.setItem('personalColor', personalColor);
      localStorage.setItem('fashionItems', JSON.stringify(fashionItems));

      // 결과 페이지로 이동
      window.location.href = '/resultpage.html';
    } catch (error) {
      console.error('에러 발생:', error);
    }
    */

    // 임시 데이터 설정
    localStorage.setItem('personalColor', '쿨톤 여름');
    localStorage.setItem('fashionItems', JSON.stringify(['파스텔 블루 셔츠', '화이트 팬츠', '실버 액세서리']));

    // 결과 페이지로 이동
    window.location.href = '/resultpage.html';
  };

  return (
    <div className="app-container">
      <h1 className="title">퍼컬 AI</h1>
      <div className="upload-page">
        <h2>사진을 업로드하고 분석하세요</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
        <button onClick={handleUpload} className="upload-button">사진 업로드 및 분석</button>
      </div>
    </div>
  );
}

export default App;
