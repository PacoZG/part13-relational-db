import axios from 'axios';

const getUserRawJSON = async (token_type: string, access_token: string, email: string) => {
  return await axios.get(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users`, {
    params: {
      email: email,
    },
    headers: { Authorization: `${token_type} ${access_token}` },
  });
};

export default getUserRawJSON;
