import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const SignUp = () => {
  const [showPass, setShowPass] = useState(false);
  const [showRepeatPass, setShowRepeatPass] = useState(false);
  const navigate = useNavigate();
  const [creds, setCreds] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  let selectedGender = creds.gender;
  const handleCheckboxChange = (gender) => {
    setCreds({ ...creds, gender: gender });
  };
  axios.defaults.withCredentials = true;
  const handleClick = async (e) => {
    e.preventDefault();
    const success = handleInputsErrors({
      username: creds.username,
      email: creds.email,
      password: creds.password,
      confirmPassword: creds.confirmPassword,
      gender: creds.gender,
    });
    if (!success) return;
    try {
      const res = await axios.post("/api/auth/register", creds);
      toast.success(res.data.message);
      const navigateTime = setTimeout(() => {
        navigate("/login");
      }, 2500);
      return () => clearTimeout(navigateTime);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };
  const handleInputsErrors = ({
    username,
    email,
    password,
    confirmPassword,
    gender,
  }) => {
    if (!username || !email || !password || !confirmPassword || !gender) {
      toast.error("Please fill all the fields");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("passwords do not match");
      return false;
    }
    if (username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return false;
    }
    if (!email.includes("@")) {
      toast.error("Email must be valid");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };
  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center bg-[url('/bg.jpg')] bg-cover bg-no-repeat bg-fixed ">
      <div className="w-[35%] min-w-[450px] in-h-[600px] gap-5 flex flex-col p-6 shadow-md shadow-[#223664] bg-transparent bg-clip-padding  backdrop-filter backdrop-blur-lg bg-opacity-0 ">
        <h1 className="text-center text-3xl font-bold p-5">Sign Up</h1>
        <form className=" flex flex-col gap-3">
          <label className="input input-bordered bg-transparent flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Username"
              value={creds.username}
              onChange={(e) => setCreds({ ...creds, username: e.target.value })}
            />
          </label>
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
              value={creds.email}
              onChange={(e) => setCreds({ ...creds, email: e.target.value })}
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
                value={creds.password}
                onChange={(e) =>
                  setCreds({ ...creds, password: e.target.value })
                }
              />
              <FontAwesomeIcon
                icon={faEye}
                className="cursor-pointer"
                onClick={() => setShowPass(!showPass)}
              />
            </div>
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
                type={showRepeatPass ? "text" : "password"}
                className="grow"
                placeholder="Confirm Password"
                value={creds.confirmPassword}
                onChange={(e) =>
                  setCreds({ ...creds, confirmPassword: e.target.value })
                }
              />
              <FontAwesomeIcon
                icon={faEye}
                className="cursor-pointer"
                onClick={() => setShowRepeatPass(!showRepeatPass)}
              />
            </div>
          </label>
          <div className="flex gap-5">
            <div className="form-control">
              <label
                className={`label gap-2 cursor-pointer ${
                  selectedGender === "male" ? "selected" : ""
                }`}
              >
                <span className="label-text">Male</span>
                <input
                  type="checkbox"
                  className="checkbox border-slate-500"
                  checked={selectedGender === "male"}
                  onChange={() => handleCheckboxChange("male")}
                />
              </label>
            </div>
            <div className="form-control">
              <label
                className={`label gap-2 cursor-pointer ${
                  selectedGender === "female" ? "selected" : ""
                }`}
              >
                <span className="label-text">Female</span>
                <input
                  type="checkbox"
                  className="checkbox border-slate-500"
                  checked={selectedGender === "female"}
                  onChange={() => handleCheckboxChange("female")}
                />
              </label>
            </div>
          </div>
        </form>
        <button
          className="btn btn-primary w-full text-lg"
          onClick={handleClick}
        >
          Sign Up
        </button>
        <Link
          to={"/login"}
          className="text-sm self-center hover:underline hover:text-blue-600 mt-2 inline-block"
        >
          Already have an account?
        </Link>
      </div>
    </div>
  );
};
