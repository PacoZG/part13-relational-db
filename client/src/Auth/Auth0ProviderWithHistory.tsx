import { Auth0Provider } from '@auth0/auth0-react';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface Auth0ProviderProps {
  children: React.ReactNode;
}

const Auth0ProviderWithHistory: FC<Auth0ProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const domain: string = process.env.REACT_APP_AUTH0_DOMAIN as string;
  const clientId: string = process.env.REACT_APP_AUTH0_CLIENT_ID as string;

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;
