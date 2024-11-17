import "./style.scss";
import { Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { AuthContext } from "./Context/AuthContext.jsx";
import { DarkModeContext } from "./Context/DarkModeContext.jsx";
import { Toaster } from "react-hot-toast";

import Cookies from "js-cookie";
import { Home } from "./Pages/Home.jsx";
import { Profile } from "./Pages/Profile.jsx";
import { SignUp } from "./Pages/Register.jsx";
import { Login } from "./Pages/Login.jsx";
import { Chat } from "./Pages/Chat.jsx";

function App() {
  window.scrollTo(0, 0);
  const { darkMode } = useContext(DarkModeContext);
  const queryClient = new QueryClient();

  const ProtectedRoute = ({ children }) => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refreshToken");
    const { user, refreshAccessToken } = useContext(AuthContext);

    useEffect(() => {
      if (!accessToken && refreshToken) {
        refreshAccessToken();
      }
    }, [accessToken, refreshToken, refreshAccessToken]);

    if (!accessToken && (!refreshToken || !user)) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <div className={darkMode ? "dark" : "light"}>
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              </div>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <div className={darkMode ? "dark" : "light"}>
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              </div>
            }
          />
          <Route
            path="/message/:id"
            element={
              <div className={darkMode ? "dark" : "light"}>
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
        </Routes>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
