
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default Index;

// import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import App from './App';
// import InterviewPage from './pages/InterviewPage';
// import InterviewQuestionsPage from './pages/InterviewQuestionsPage';

// ReactDOM.render(
//   <BrowserRouter>
//     <Routes>
//       <Route path="/" element={<InterviewPage/>}/>
//       <Route path="/questions" element={<InterviewQuestionsPage/>}/>
//     </Routes>
//   </BrowserRouter>,
//   document.getElementById('root')
// );
