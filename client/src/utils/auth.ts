import auth0 from 'auth0-js';

const domain: string = process.env.REACT_APP_AUTH0_DOMAIN as string;
const clientId: string = process.env.REACT_APP_AUTH0_CLIENT_ID as string;

const auth = new auth0.WebAuth({
  audience: 'http://localhost:3000',
  domain: domain,
  clientID: clientId,
  redirectUri: `${window.location.origin}`,
  responseType: 'token id_token',
  scope: 'openid permissions profile groups roles email',
});

export const login = () => {
  auth.authorize({ login_hint: '' });
};

export let userProfile: auth0.Auth0UserProfile;
let tokenRenewalTimeout: any;

export const getProfile = (cb?: any): void => {
  const accessToken = getAccessToken();
  if (accessToken) {
    auth.client.userInfo(accessToken, (err: any, profile: any) => {
      if (profile) {
        userProfile = profile;
      }
      if (cb) {
        cb(err, profile);
      }
    });
  }
};

export const setSession = (authResult: any) => {
  const scopes = authResult.scope || '';
  localStorage.setItem('access_token', authResult.accessToken);
  localStorage.setItem('id_token', authResult.idToken);

  localStorage.setItem('scopes', JSON.stringify(scopes));
  scheduleRenewal();
};

export const renewToken = () => {
  auth.checkSession({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      setSession(result);
    }
  });
};

export const scheduleRenewal = () => {
  const expiresAt = JSON.parse(localStorage.getItem('expires_at') as string);
  const delay = expiresAt - Date.now();
  if (delay > 0) {
    tokenRenewalTimeout = setTimeout(() => {
      renewToken();
    }, delay);
  }
};

export const getIdToken = () => {
  const accessToken = localStorage.getItem('id_token');
  if (!accessToken) {
    return '';
  }
  return accessToken;
};

export const getAccessToken = () => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    return '';
  }
  return accessToken;
};

export const logout = () => {
  auth.logout();
};

export const checkAuthentication = async () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  console.log('HERE: ', isAuthenticated);
  auth.parseHash(async (err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      setSession(authResult);
      // getProfile(() => {
      //   if (isFirstLogin()) {
      //     history.push('/license-agreement');
      //     return;
      //   }
      // });
      // history.push('/search');
    } else if (err) {
      // history.push('/search');
      console.log(err);
    }
  });
};

// export {};

export default auth;
function moment() {
  throw new Error('Function not implemented.');
}
