// import "dotenv/config"
import axios from "axios";
import { AuthHeader } from "./auth.header";

let base_url = "http://147.93.131.225/digi/auth";

export const register = async ({
  data,
}: {
  data: User;
}): Promise<User | false> => {
  try {
    const response = await axios.post<AuthState>(`${base_url}/register/`, data);

    if (response.status !== 200) {
      console.log("credenciales incorrectas");
      return false;
    }

    const user_info = response.data.user;
    user_info.token && localStorage.setItem("user", user_info.token);
    axios.defaults.headers.common[
      "authorization"
    ] = `bearer ${user_info.token}`;
    return user_info;
  } catch (error) {
    console.error(error);
    return false;
  }
};
export const update_pass = async (
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  const headers = AuthHeader();
  if (!headers.authorization) return false;

  try {
    await axios.put(
      `${base_url}/me/`,
      { current_password: currentPassword, new_password: newPassword },
      { headers }
    );
    return true;
  } catch (error: any) {
    console.log(error.response?.data?.user?.message || error.message);
    return false;
  }
};

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<
  { user: { token: string; username: string; is_superuser: boolean } } | false
> => {
  try {
    const response = await axios.post<{
      user: { token: string; username: string; is_superuser: boolean };
    }>(`${base_url}/login/`, { username, password });

    if (response.status !== 200) {
      console.log("credenciales incorrectas");
      return false;
    }
    const user_info = response.data.user;
    localStorage.setItem("user", user_info.token);
    axios.defaults.headers.common[
      "authorization"
    ] = `bearer ${user_info.token}`;
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("user");
  window.location.replace("/login");
  return true;
};

export const check_token = async () => {
  const headers = AuthHeader();
  if (!headers.authorization) return false;

  try {
    const response = await axios.get(`${base_url}/me/`, { headers });
    return response.data.user;
  } catch (error: any) {
    if (error.response?.status === 403) {
      logout();
    } else {
      console.log(error.message);
      console.log("error", error);
    }
    return false;
  }
};
