import { useAuth0 } from '@auth0/auth0-react';
import * as React from 'react';
import './App.scss';
import logo from './assets/logo.svg';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import { getValue, removeValue } from './utils/useLocalStorage';

const Main: React.FC = () => {
  const { isAuthenticated, isLoading, logout } = useAuth0();
  const [accessToken, SetAccessToken] = React.useState<String | null>(null);

  React.useEffect(() => {
    if (getValue('user_token')) {
      SetAccessToken(getValue('user_token'));
    }
  }, [accessToken]);

  const handleLougout = async () => {
    await logout();
    removeValue('logged_user');
    removeValue('user_token');
  };

  if (isLoading && !accessToken) {
    return (
      <div className="login-container">
        <img src={logo} className="App-logo" alt="logo" />
        Loading...
      </div>
    );
  }

  if (!isAuthenticated && !accessToken) {
    return <Login />;
  }

  return (
    <div>
      <Home logout={handleLougout} />
    </div>
  );
};

export default Main;
