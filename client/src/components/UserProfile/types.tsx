interface Claims {
  aud: string;
  email: string;
  email_verified: boolean;
  exp: number;
  iat: number;
  iss: string;
  name: string;
  nickname: string;
  nonce: string;
  picture: string;
  sid: string;
  sub: string;
  updated_at: string;
}

interface Encoded {
  header: string;
  payload: string;
  signature: string;
}

interface Header {
  alg: string;
  kid: string;
  typ: string;
}

interface User {
  name: string;
  email: string;
  email_verified: boolean;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;
}

export interface LoginInfo {
  decodedToken: { claims: Claims; encoded: Encoded; header: Header; user: User };
  id_token: string;
}

export interface UserRawJSON {
  created_at: string;
  email: string;
  email_verified: boolean;
  identities: any;
  last_ip: string;
  last_login: string;
  logins_count: number;
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
}
