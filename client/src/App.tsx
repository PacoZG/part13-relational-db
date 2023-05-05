import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';
import Main from './Main';
import Callback from './components/Callback/Callback';
import UserProfile from './components/UserProfile/UserProfile';

const App: React.FC = () => {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Navigate to="/main" />} />

        <Route path="/main" element={<Main />} />
        <Route path="/user-info" element={<UserProfile />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </div>
  );
};

export default App;
