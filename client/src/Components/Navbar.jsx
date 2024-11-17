import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBars, faMoon } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext.jsx";
import { DarkModeContext } from "../Context/DarkModeContext.jsx";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios.js";

export const Navbar = ({ search, setSearch }) => {
  const [openProfile, setOpenProfile] = useState(false);

  const { user } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const { isLoading, data, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await makeRequest.get(`user/find/${user.id}`);
      return response.data;
    },
  });

  // Extract first letter of each word in the username
  if (data) {
    var firstLetter = data.username
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }
  const navigate = useNavigate();
  const ref = useRef(null);

  axios.defaults.withCredentials = true;
  const handleLogout = async () => {
    const res = await axios.post("/api/auth/logout");
    localStorage.removeItem("user");
    navigate("/login");

    const navigateTime = setTimeout(() => {
      toast.success(res.data.message);
    }, 100);
    return () => clearTimeout(navigateTime);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
  }, [ref]);
  return (
    <nav className="w-full flex items-center justify-around shadow-sm shadow-[gray] p-2 h-max">
      <h1
        className="text-xl text-red-400 font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        ChatterSphere
      </h1>
      <label className="input input-bordered bg-transparent flex items-center gap-2 w-[300px] h-[40px]">
        <input
          type="text"
          className="grow"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
      <div className="flex gap-2">
        <FontAwesomeIcon
          icon={faMoon}
          className="text-xl cursor-pointer hover:scale-[1.1]"
          onClick={() => setDarkMode(!darkMode)}
        />
        <FontAwesomeIcon
          icon={faBell}
          className="text-xl cursor-pointer hover:scale-[1.1]"
        />
      </div>
      {data && (
        <div
          ref={ref}
          className=" relative shadow-md shadow-[#565656]  rounded-full"
        >
          <button
            className=" size-[50px] text-xl rounded-full transition-all font-semibold uppercase"
            onClick={() => setOpenProfile(!openProfile)}
          >
            {firstLetter}
          </button>
          {openProfile && (
            <ul
              className={
                darkMode
                  ? " absolute bottom-[-85px] left-[-15px] w-[100px] text-lg bg-[rgb(32,32,32)] text-white p-2 space-y-2 z-10 rounded-md"
                  : " absolute bottom-[-85px] left-[-15px] w-[100px] text-lg bg-[rgb(244,244,245)] p-2 space-y-2 z-10 rounded-md"
              }
            >
              <li
                className={
                  darkMode
                    ? "cursor-pointer hover:bg-[rgb(48,47,47)] rounded-md hover:scale-[1.1] transition-all text-center"
                    : "cursor-pointer hover:bg-[rgb(235,235,235)] rounded-md hover:scale-[1.1] transition-all text-center"
                }
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                Profile
              </li>
              <li
                className={
                  darkMode
                    ? "cursor-pointer hover:bg-[rgb(48,47,47)] rounded-md hover:scale-[1.1] transition-all text-center"
                    : "cursor-pointer hover:bg-[rgb(235,235,235)] rounded-md hover:scale-[1.1] transition-all text-center"
                }
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      )}
    </nav>
  );
};
