export interface JWTProfile {
  id?: number;
  name?: string;
  roles?: string[];
  iat?: number;
  exp?: number;
  token?: string;
  username?: string;
}

