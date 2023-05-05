import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.scss';

import logo from '../../assets/logo.svg';

interface HomeProps {
  logout: () => void;
}

const Home: React.FC<HomeProps> = ({ logout }) => {
  const navigate = useNavigate();
  const handleGoToPage = () => {
    navigate('/user-info');
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <button className="style" onClick={logout}>
            Log Out
          </button>
          <button className="style" onClick={handleGoToPage}>
            View user information
          </button>
        </div>
      </header>
    </div>
  );
};

export default Home;
