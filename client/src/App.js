import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null); // 업로드한 사진의 미리보기 URL
  const [personalColor, setPersonalColor] = useState('');
  const [fashionItems, setFashionItems] = useState([]);
  const [isResultDisplayed, setIsResultDisplayed] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewURL(URL.createObjectURL(file)); // 파일을 미리보기 URL로 설정
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    // 백엔드 통신 부분 주석 처리하여 임시로 2페이지로 이동하게 함
    /*
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/api/predict', formData);
      setPersonalColor(response.data.personal_color);
      setFashionItems(response.data.fashion_items);
      setIsResultDisplayed(true);
    } catch (error) {
      console.error('에러 발생:', error);
    }
    */

    // 임시로 결과 페이지로 이동하고 임시 데이터 설정
    setPersonalColor('쿨톤 여름');
    setFashionItems(['파스텔 블루 셔츠', '화이트 팬츠', '실버 액세서리']);
    setIsResultDisplayed(true);
  };

  const handleBack = () => {
    // 뒤로 가기 버튼 클릭 시 초기 상태로 복원
    setIsResultDisplayed(false);
    setSelectedFile(null);
    setPreviewURL(null); // 미리보기 URL 초기화
    setPersonalColor('');
    setFashionItems([]);
  };

  return (
    <div className="app-container">
      <h1 className="title">퍼컬 AI</h1>

      {!isResultDisplayed ? (
        // 사진 업로드 화면
        <div className="upload-page">
          <h2>사진을 업로드하고 분석하세요</h2>
          <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
          <button onClick={handleUpload} className="upload-button">사진 업로드 및 분석</button>
        </div>
      ) : (
        // 결과 화면
        <div className="result-page">
          {previewURL && <img src={previewURL} alt="Uploaded" className="uploaded-image" />} {/* 업로드한 사진 표시 */}
          <h2>퍼스널 컬러 결과</h2>
          <p className="personal-color">{personalColor}</p>
          <h3>추천 패션 아이템:</h3>
          <ul className="fashion-items">
            {fashionItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <button onClick={handleBack} className="back-button">뒤로 가기</button>
        </div>
      )}
    </div>
  );
}

export default App;
