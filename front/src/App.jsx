
import React, { useState } from "react";
import Navbar from './components/Navbar';
import PostForm from './components/PostForm';
import Category from './components/Category';
import { sendMessage } from "./api/axios";
import './App.css'; // 기존 App.css를 유지하여 전체적인 스타일링 가능
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Route, Routes } from "react-router-dom";


function MainLayout() {
  return (
    <div className="MainLayout">
      <Navbar />
      <PostForm />
      <Routes>
        {/* 이 라우트는 App 컴포넌트의 메인 라우터로 이동되었습니다. */}
      </Routes>
    </div>
  );
}

function App() {
  // Category 컴포넌트에 전달할 임시 데이터입니다.
  // TODO: 추후 API를 통해 실제 데이터를 받아오도록 수정해야 합니다.
  const [products, setProducts] = useState([
    { id: 1, pet_type: 'dog', category: 'food', title: '튼튼 강아지 사료', price: 35000, views: 120, review_count: 12, imgUrl: '/images/dog_food.jpg' },
    { id: 2, pet_type: 'dog', category: 'toy', title: '삑삑이 공', price: 8000, views: 250, review_count: 25, imgUrl: '/images/dog_toy.jpg' },
    { id: 3, pet_type: 'cat', category: 'food', title: '연어맛 고양이 캔', price: 2500, views: 300, review_count: 40, imgUrl: '/images/cat_food.jpg' },
    { id: 4, pet_type: 'cat', category: 'sand', title: '응고형 벤토나이트 모래', price: 12000, views: 180, review_count: 22, imgUrl: '/images/cat_sand.jpg' },
  ]);

  return (
    <div className="App">
      
      <Routes>
        {/* 로그인 / 회원가입 (네비바, 푸터 없음) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 카테고리 페이지 (네비바 포함) */}
        <Route path="/category/:pet/:sub?" element={<><Navbar /><Category items={products} /></>} />

        {/* 로그인 이후 메인 페이지 */}
        <Route path="/main" element={<MainLayout />} />

        <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
      </Routes>
    </div>
  );
}

export default App;
