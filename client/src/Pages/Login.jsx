import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const { loading, dispatch } = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();
    const success = handleInputsError({
      email,
      password,
    });
    if (!success) return;
    dispatch({ type: "LOGIN_StART" });
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      navigate("/");
    } catch (error) {
      dispatch({ type: "LOGIN_FAILED", payload: error.response.data });
      toast.error(error.response.data.error);
    }
  };
  const handleInputsError = ({ email, password }) => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (!email.includes("@")) {
      toast.error("Email is not valid");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };
  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center bg-[url('/bg.jpg')] bg-cover bg-no-repeat bg-fixed">
      <div className="w-[35%] min-w-[450px] h-[60%] min-h-[400px] gap-5 flex flex-col p-6 shadow-md shadow-[#223664] bg-transparent bg-clip-padding  backdrop-filter backdrop-blur-lg bg-opacity-0 ">
        <h1 className="text-center text-3xl font-bold p-5">Login</h1>
        <form className=" flex flex-col gap-3">
          <label className="input input-bordered bg-transparent flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="input input-bordered bg-transparent flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <div className="w-full flex items-center">
              <input
                type={showPass ? "text" : "password"}
                className="grow"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faEye}
                className="cursor-pointer"
                onClick={() => setShowPass(!showPass)}
              />
            </div>
          </label>
        </form>
        <button
          className="btn btn-primary w-full text-lg"
          onClick={handleClick}
        >
          Login
        </button>
        <Link
          to={"/register"}
          className="text-sm self-center hover:underline hover:text-blue-600 mt-2 inline-block"
        >
          {"Don't"} have an account?
        </Link>
      </div>
    </div>
  );
};
