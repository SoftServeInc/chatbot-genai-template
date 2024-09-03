export interface Credentials {
  username: string;
  password: string;
}

export interface UserInfo {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

export interface TermsInfo {
  id: string;
  url: string;
  published_at: string;
  agreed: boolean;
}

export interface AuthInfo {
  user: UserInfo;
  token: string;
  terms?: TermsInfo;
}
