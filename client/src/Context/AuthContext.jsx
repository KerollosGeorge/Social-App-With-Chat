import { createContext, useEffect, useReducer } from "react";
import axios from "axios";

const INIT_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INIT_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case "LOGIN_FAILED":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INIT_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  const refreshAccessToken = async () => {
    try {
      const res = await axios.post("/api/refresh");
      const newAccessToken = res.data.accessToken;
      const updatedUser = { ...state.user, accessToken: newAccessToken };
      dispatch({
        type: "UPDATE_USER",
        payload: updatedUser,
      });
      Cookies.set("access_token", newAccessToken, { sameSite: "Strict" });
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      dispatch({ type: "LOGOUT" });
    }
  };

  const updateUser = (user) => {
    dispatch({
      type: "UPDATE_USER",
      payload: user,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
        updateUser,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
