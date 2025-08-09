import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Signup } from './pages/Signup';
import Home from './pages/Home';
import Customizer from './pages/Customizer'; 
import Bot from './pages/Bot';
import Canvas from "./canvas/index.jsx";
import CHome from './pages/CHome.jsx';
import Settings from './pages/Settings.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Surveys from './pages/Surveys.jsx';
import SurveyView from './pages/SurveyView.jsx';
import SurveyPublicView from './pages/SurveyPublicView.jsx';
import ViewAnswers from './pages/AnswerView';
import SocialMedia from './pages/SocialMedia'; 




const App = () => {
  const location = useLocation();
  const isCustomizerRoute = location.pathname === '/studio';
  const isCHomeRoute = location.pathname === '/studio'; // Check if the current route is /chome

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 overflow-y-auto transition-all ease-in">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/main" element={<Home />} />
          <Route path="/chat" element={<Bot />} />
          <Route path="/studio" element={<CHome />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/surveyspace" element={<Dashboard />} />
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/surveys/create" element={<SurveyView />} />
          <Route path="/surveys/:id" element={<SurveyView />} />  
          <Route path="/view/survey/:slug" element={<SurveyPublicView />} />
          <Route path="/survey/public/:slug" element={<SurveyPublicView />} />
          <Route path="/surveys/:id/answers" element={<ViewAnswers />} />
          <Route path="/social-media" element={<SocialMedia />} />


        </Routes>
        {isCHomeRoute && (
          <div className="canvas-container flex items-end justify-center">
  <Canvas />
</div>

)}

        {isCustomizerRoute && <Customizer />}
      </main>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
