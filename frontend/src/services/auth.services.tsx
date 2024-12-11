// import "dotenv/config"
import axios from "axios";
import { AuthHeader, removeAuthToken, setAuthToken } from "./auth.header";

export const register = async ({
  email,
  password,
  username,
  first_name,
  last_name,
}: RegisterForm): Promise<AuthenticationUserResponse["user"] | false> => {
  try {
    const response = await axios.post<AuthenticationUserResponse>(
      `${import.meta.env.VITE_BASE_URL}/auth/register/`,
      { email, password, username, first_name, last_name }
    );

    if (response.status !== 200) {
      console.log("credenciales incorrectas");
      return false;
    }

    const { token } = response.data.user;
    if (token) {
      setAuthToken(token);
      axios.defaults.headers.common[
        "authorization"
      ] = `bearer ${token}`;
    }
    return response.data.user;
  } catch (error) {
    console.error("Error en el registro:", error);
    return false;
  }
};
// export const update_pass = async (
//   currentPassword: string,
//   newPassword: string
// ): Promise<boolean> => {
//   const headers = AuthHeader();
//   if (!headers.authorization) return false;

//   try {
//     await axios.put(
//       `${base_url}/me/`,
//       { current_password: currentPassword, new_password: newPassword },
//       { headers }
//     );
//     return true;
//   } catch (error: any) {
//     console.log(error.response?.data?.user?.message || error.message);
//     return false;
//   }
// };

export const login = async ({
  /* [EL LOGIN TAMBIEN DEBE DEVOLVER UN AUTHENTICATION RESPONSE] */
  username,
  password,
}: LoginForm): Promise<
  { user: { token: string; username: string; is_superuser: boolean } } | false
> => {
  try {
    const response = await axios.post<{
      user: { token: string; username: string; is_superuser: boolean };
    }>(`${import.meta.env.VITE_BASE_URL}/auth/login/`, { username, password });

    if (response.status !== 200) {
      console.log("credenciales incorrectas");
      return false;
    }

    const { token } = response.data.user;
    if (!token) return false;
    setAuthToken(token);
    axios.defaults.headers.common[
      "authorization"
    ] = `bearer ${token}`;
    return response.data;
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    return false;
  }
};

export const logout = () => {
  removeAuthToken();
  window.location.href = "/login";
  return true;
};

export const isUserAuthenticated = async () => {
  const headers = AuthHeader();
  if (!headers.authorization) return false;

  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/me/`, {
      headers,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      logout();
    } else {
      console.error("Error al verificar el token:", error);
    }
    return false;
  }
};
