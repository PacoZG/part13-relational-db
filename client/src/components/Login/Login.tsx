import { useAuth0 } from '@auth0/auth0-react';
import * as React from 'react';
import './login.scss';

const Login: React.FC = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div>
      {isAuthenticated ? null : (
        <div className="login-container">
          <h1>BLOGGER APP</h1>

          <h2>This is an app developed as part of the full stack open part 13 course</h2>

          <div className="">
            <button onClick={() => loginWithRedirect()}>Register</button>

            <button onClick={() => loginWithRedirect()}>Log in</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
