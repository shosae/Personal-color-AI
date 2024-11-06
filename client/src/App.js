import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null); // 업로드한 파일 저장
  const [previewURL, setPreviewURL] = useState(null); // 업로드한 사진의 미리보기 URL
  const [personalColor, setPersonalColor] = useState(''); // 벡엔드에서 받은 PERSONAL COLOR 저장
  const [fashionItems, setFashionItems] = useState([]); // PERSONAL COLOR에 맞는 Fashion Items List저장
  const [isResultDisplayed, setIsResultDisplayed] = useState(false); // 결과 페이지 표시 여부 저장

  const handleFileChange = (event) => { // 파일 선택 시 호출되는 핸들러
    const file = event.target.files[0]; // 선택된 파일 file에 저장
    setSelectedFile(file);  //selectedFile에 저장
    setPreviewURL(URL.createObjectURL(file)); // 파일을 미리보기 URL로 설정
  };

  const handleUpload = async () => { // 백엔드로 파일 업로드하는 핸들러
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData(); 
    formData.append('image', selectedFile);

    //axios를 통해 백엔드에 POST request 전송
    try {
      const response = await axios.post('http://localhost:8000/api/predict', formData);
      setPersonalColor(response.data.personal_color); //Personal Color
      setFashionItems(response.data.fashion_items); //Fashion Item 
      setIsResultDisplayed(true); //결과 페이지로 이동
    } catch (error) {
      console.error('에러 발생:', error);
    }
    

    // 임시로 결과 페이지로 이동하고 임시 데이터 설정
    setPersonalColor('쿨톤 여름');
    setFashionItems(['파스텔 블루 셔츠', '화이트 팬츠', '실버 액세서리']);
    setIsResultDisplayed(true);
  };

  const handleBack = () => { // 뒤로가기 핸들러
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
          <div className="fashion-items-container" style={{ display: 'flex', gap: '20px' }}>
  <div className="fashion-item" style={{ flex: 1 }}>
    <h3>상의 추천</h3>
    <iframe 
      src="https://www.musinsa.com/category/001?gf=A&color=1" 
      title="Top Items" 
      style={{
        width: '100%', 
        height: '1000px', 
        border: 'none', 
        overflow: 'auto' 
      }}
    ></iframe>
  </div>

  <div className="fashion-item" style={{ flex: 1 }}>
    <h3>하의 추천</h3>
    <iframe 
      src="https://www.musinsa.com/category/003?gf=A&color=1" 
      title="Bottom Items" 
      style={{
        width: '100%', 
        height: '1000px', 
        border: 'none', 
        overflow: 'auto' 
      }}
    ></iframe>
  </div>
</div>
        
          {/* <h3>추천 패션 아이템:</h3>
          <ul className="fashion-items">
            {fashionItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul> */}
          <button onClick={handleBack} className="back-button">뒤로 가기</button>
        </div>
      )}
    </div>
  );
}

export default App;
