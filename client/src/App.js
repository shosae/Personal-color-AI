// // src/App.js
// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       alert("파일을 선택해주세요.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", selectedFile);

//     try {
//       const response = await axios.post("http://localhost:8000/upload", formData);
//       console.log("업로드 성공:", response.data);
//     } catch (error) {
//       console.error("업로드 실패:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>파일 업로드</h1>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>업로드</button>
//     </div>
//   );
// }

// export default App;

// App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [personalColor, setPersonalColor] = useState('');
  const [fashionItems, setFashionItems] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/api/predict', formData);
      setPersonalColor(response.data.personal_color);
      setFashionItems(response.data.fashion_items);
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  return (
    <div>
      <h1>퍼컬 AI</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>사진 업로드 및 분석</button>

      {personalColor && (
        <div>
          <h2>퍼스널 컬러 결과: {personalColor}</h2>
          <h3>추천 패션 아이템:</h3>
          <ul>
            {fashionItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
