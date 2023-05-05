/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth0 } from '@auth0/auth0-react';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import getAccessResponse from '../../doings/getAccessResponse';
import getUserRawJSON from '../../doings/getUserRaw';
import { getValue } from '../../utils/useLocalStorage';
import './UserProfile.scss';
import { LoginInfo, UserRawJSON } from './types';

const UserProfile: React.FC = () => {
  const loginInfoDefaultValues = {
    decodedToken: {
      claims: {
        aud: '',
        email: '',
        email_verified: false,
        exp: 0,
        iat: 0,
        iss: '',
        name: '',
        nickname: '',
        nonce: '',
        picture: '',
        sid: '',
        sub: '',
        updated_at: '',
      },
      encoded: {
        header: '',
        payload: '',
        signature: '',
      },
      header: { alg: '', kid: '', typ: '' },
      user: {
        name: '',
        email: '',
        email_verified: false,
        nickname: '',
        picture: '',
        sub: '',
        updated_at: '',
      },
    },
    id_token: '',
  };

  const userRawJSONDefaultValues = {
    created_at: '',
    email: '',
    email_verified: false,
    identities: [],
    last_ip: '',
    last_login: '',
    logins_count: 0,
    name: '',
    nickname: '',
    picture: '',
    updated_at: '',
    user_id: '',
  };
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth0();
  const [userRawJSON, setUserRawJSON] = React.useState<UserRawJSON>(userRawJSONDefaultValues);
  const [loginInfo, setLoginInfo] = React.useState<LoginInfo>(loginInfoDefaultValues);

  React.useEffect(() => {
    if (getValue('@@auth0spajs@@::V6JEyCvHU1VSu1K5ZQ4AKfRm81gpMa0i::@@user@@')) {
      setLoginInfo(getValue('@@auth0spajs@@::V6JEyCvHU1VSu1K5ZQ4AKfRm81gpMa0i::@@user@@'));
    }
    (async () => {
      const accessResponse = await getAccessResponse();

      const userRaw = await getUserRawJSON(
        accessResponse.data.token_type,
        accessResponse.data.access_token,
        loginInfo.decodedToken.user.email,
      );
      setUserRawJSON(userRaw.data[0]);
    })();
  }, [setLoginInfo]);

  const handleGoToPage = () => {
    navigate('/main');
  };

  const handleLougout = async () => {
    await logout();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="user-profile-container">
      {isAuthenticated && (
        <article>
          {loginInfo.decodedToken.user && (
            <img
              className="style"
              alt={loginInfo.decodedToken.user.name}
              src={loginInfo.decodedToken.user.picture}
            />
          )}
        </article>
      )}
      <h1>{loginInfo.decodedToken.user.name}</h1>
      <div>{loginInfo.decodedToken.user.email}</div>
      <p>
        {loginInfo.decodedToken.user.email_verified
          ? `Verified - Login count (${userRawJSON[0].logins_count})`
          : `Not verified  - Login count (${userRawJSON[0].logins_count})`}
      </p>
      <div className="">
        <button className="style" onClick={handleLougout}>
          Log out
        </button>
        <button className="style" onClick={handleGoToPage}>
          Home
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
