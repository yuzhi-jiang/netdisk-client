const TOKEN_KEY = 'token';
const USERID_KEY = 'user_id';

const isLogin = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const setUserID = (id: string) => {
  localStorage.setItem(USERID_KEY, id);
};

const getUserID = () => {
  return localStorage.getItem(USERID_KEY);
};

const clearUserID = () => {
  localStorage.removeItem(USERID_KEY);
};

export {
  isLogin,
  getToken,
  setToken,
  clearToken,
  getUserID,
  setUserID,
  clearUserID,
};
