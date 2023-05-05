import axios from 'axios';

const getAccessResponse = async () => {
  return await axios.post(
    `https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`,
    {
      client_id: 'fpK2Lo2N0ZftOsCHPZxbgEUesw4c873N',
      client_secret: 'E_ML2O3I_rO5-Zn7lIIs75iJSCZUFoiIm-2LH7O16gZ5U6SqCfRgFkaybgyj3T9R',
      audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials',
    },
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  );
};

export default getAccessResponse;
