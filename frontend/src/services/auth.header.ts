export const AuthHeader = () => {
  const user = getAuthToken();
  return {
    authorization: user ? `Bearer ${user}` : "",
  };
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const removeAuthToken = () => {
  localStorage.removeItem("token");
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};