import {
  faGlobe,
  faLocationDot,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { makeRequest } from "../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const EditProfile = ({ data, setEditProfile }) => {
  const [user, setUser] = useState({
    username: data.username,
    email: data.email,
    city: data.city,
    country: data.country,
    gender: data.gender,
  });

  const handleEdit = async (e) => {
    e.preventDefault();
    const success = handleInputsErrors(user);
    if (!success) return;
    try {
      mutation.mutate(user);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.Error);
    }
  };

  const handleInputsErrors = ({ username, email, city, country, gender }) => {
    if (
      username === data.username &&
      email === data.email &&
      city === data.city &&
      country === data.country &&
      gender === data.gender
    ) {
      toast.error("No changes made");
      return false;
    }
    if (!username || !email || !city || !country || !gender) {
      toast.error("Please fill all the fields");
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
    return true;
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (user) => {
      const res = await makeRequest.put(`user/${data.id}`, user);
      toast.success(res.data.message);
      setEditProfile(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex justify-between items-center">
        <h2 className=" w-full text-center text-2xl">Edit Profile</h2>
        <span onClick={() => setEditProfile(false)}>
          <FontAwesomeIcon
            icon={faXmark}
            className=" size-6  text-red-500 cursor-pointer hover:scale-[1.1] transition-all hover:text-red-600"
          />
        </span>
      </div>
      <form className=" flex flex-col gap-3 ">
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
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
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
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </label>
        <label className="input input-bordered bg-transparent flex items-center gap-2">
          <FontAwesomeIcon icon={faLocationDot} />
          <input
            type="text"
            className="grow"
            placeholder="City"
            value={user.city}
            onChange={(e) => setUser({ ...user, city: e.target.value })}
          />
        </label>
        <label className="input input-bordered bg-transparent flex items-center gap-2">
          <FontAwesomeIcon icon={faGlobe} />
          <input
            type="text"
            className="grow"
            placeholder="Country"
            value={user.country}
            onChange={(e) => setUser({ ...user, country: e.target.value })}
          />
        </label>
        <div className="flex gap-5">
          <div className="form-control">
            <label className="label gap-2 cursor-pointer">
              <span className="label-text">Male</span>
              <input
                type="radio"
                className="radio border-slate-500"
                checked={user.gender === "male"}
                onChange={() => setUser({ ...user, gender: "male" })}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label gap-2 cursor-pointer">
              <span className="label-text">Female</span>
              <input
                type="radio"
                className="radio border-slate-500"
                checked={user.gender === "female"}
                onChange={() => setUser({ ...user, gender: "female" })}
              />
            </label>
          </div>
        </div>
        <button
          className="btn btn-primary text-lg w-[200px] self-center"
          onClick={handleEdit}
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
