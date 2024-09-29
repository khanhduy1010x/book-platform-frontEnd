
export const KEY_TOKEN = "accessToken";
export const EXPIRY_TIME = "accessExpirytime"
export const REFRESH_TIME = "accessRefreshTime"
export const USER = 'userInfo'
export const setUser = (user) => {
  localStorage.setItem(USER, JSON.stringify(user));
}
export const getUser = () => {
    const user = localStorage.getItem(USER);
    return user ? JSON.parse(user) : null; 
}
export const removeUser = () => {
  localStorage.removeItem(USER)
}
export const setToken = (token) => {
     localStorage.setItem(KEY_TOKEN, token);
};
export const getToken = () => {
  return localStorage.getItem(KEY_TOKEN);
};
export const removeToken = () => {
  return localStorage.removeItem(KEY_TOKEN);
};

export const setExpiryTime = (expiryTime) => {
    localStorage.setItem(EXPIRY_TIME, expiryTime);
};
export const getExpiryTime = () => {
 return localStorage.getItem(EXPIRY_TIME);
};
export const removeExpiryTime = () => {
 return localStorage.removeItem(EXPIRY_TIME);
};
export const setRefreshTime = (refreshTime) => {
    localStorage.setItem(REFRESH_TIME, refreshTime);
};
export const getRefreshTime = () => {
 return localStorage.getItem(REFRESH_TIME);
};
export const removeRefreshTime = () => {
 return localStorage.removeItem(REFRESH_TIME);
};



