import { useAuth0 } from '@auth0/auth0-react';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback: FC<{}> = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();
  React.useEffect(() => {
    (async () => {
      if (user) {
        // setValue('logged_user', user);
        // setValue('isAuthenticated', isAuthenticated);
        // setValue('user_token', await getAccessTokenSilently());
        navigate('/main');
      }
    })();
  }, [getAccessTokenSilently, navigate, user]);

  return <div className="callback" />;
};

export default Callback;
