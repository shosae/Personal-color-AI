import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  
    // 파일을 Base64로 인코딩하여 저장
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreviewURL(base64String);
      localStorage.setItem('previewURL', base64String); // Base64 문자열을 저장
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    // 임시로 데이터 저장 및 페이지 이동
    localStorage.setItem('personalColor', '쿨톤 여름');
    localStorage.setItem('fashionItems', JSON.stringify(['파스텔 블루 셔츠', '화이트 팬츠', '실버 액세서리']));
    localStorage.setItem('previewURL', previewURL); // 미리보기 URL을 로컬 저장소에 저장

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
