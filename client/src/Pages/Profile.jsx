import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext.jsx";
import { Navbar } from "../Components/Navbar.jsx";
import toast from "react-hot-toast";
import { LeftSidebar } from "../Components/LeftSidebar.jsx";
import { RightSidebar } from "../Components/RightSidebar.jsx";
import { ShareTo } from "../Components/ShareTo.jsx";
import {
  faGlobe,
  faImage,
  faLocationDot,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios.js";
import { useLocation, useNavigate } from "react-router-dom";
import EditProfile from "../Components/EditProfile.jsx";

export const Profile = () => {
  const { user } = useContext(AuthContext);
  const [editProfile, setEditProfile] = useState(false);
  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const navigate = useNavigate();

  const { isLoading, data } = useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const res = await makeRequest.get(`user/find/${userId}`);
      return res.data;
    },
  });

  const [inputs, setInputs] = useState({});
  const [coverPic, setCoverPic] = useState(user.coverPic);
  const [profilePic, setProfilePic] = useState(user.profilePic);

  useEffect(() => {
    if (data) {
      setInputs(data);
    }
  }, [data]);

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload/personalImages", formData); // Make sure to use the correct API endpoint
      return res.data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to upload image");
    }
  };
  const userQueryClient = useQueryClient();
  const userMutation = useMutation({
    mutationFn: async (data) => {
      const res = await makeRequest.put(`user/${user.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      userQueryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleUpdateImages = async () => {
    let updatedInputs = { ...inputs }; // Start with the current input values

    // Upload coverPic if it's changed
    if (coverPic && coverPic !== user.coverPic) {
      const uploadedCoverPic = await upload(coverPic);
      updatedInputs.coverPic = uploadedCoverPic;
    }

    // Upload profilePic if it's changed
    if (profilePic && profilePic !== user.profilePic) {
      const uploadedProfilePic = await upload(profilePic);
      updatedInputs.profilePic = uploadedProfilePic;
    }

    // If any of the images were updated, call the mutation to update the user
    if (updatedInputs.coverPic || updatedInputs.profilePic) {
      userMutation.mutate(updatedInputs);
      toast.success("Profile updated successfully!");
    } else {
      toast.error("No changes detected.");
    }

    setEditProfile(false);
  };

  const { isLoading: relationLoading, data: relationData } = useQuery({
    queryKey: ["relationships"],
    queryFn: async () => {
      const res = await makeRequest.get(`relations?id=${userId}`);
      return res.data;
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (following) => {
      if (following) {
        const res = await makeRequest.delete(`relations?userId=${userId}`);
        toast.error(res.data.message);
        return res.data;
      }
      const res = await makeRequest.post("relations", { userId });
      toast.success(res.data.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationships"] });
    },
  });

  const handleFollow = () => {
    mutation.mutate(
      relationData?.some((relation) => relation.followerUserId == user.id)
    );
  };

  return (
    <div className=" w-full flex flex-col">
      {isLoading ? (
        <div className="loading loading-spinner"></div>
      ) : (
        <>
          <Navbar />
          <div className="w-full grid grid-cols-4 text-center mt-5 gap-5 max-md:flex max-md:flex-col min-w-[500px]">
            <LeftSidebar />

            <div className="w-full relative flex justify-center flex-col gap-5 col-span-2">
              <div className="relative">
                <img
                  src={
                    coverPic && coverPic !== user.coverPic
                      ? URL.createObjectURL(coverPic)
                      : `/personalImages/${inputs.coverPic}`
                  }
                  alt="Cover Image"
                  className=" w-full h-[300px] shadow-md shadow-[gray] rounded-lg"
                />
                {userId == user.id && (
                  <div className="absolute bottom-2 right-3 text-2xl">
                    <label
                      htmlFor="coverPicUpload"
                      className="cursor-pointer flex gap-4 items-center"
                    >
                      Edit
                      <FontAwesomeIcon icon={faImage} className="scale-[1.5]" />
                    </label>
                    <input
                      type="file"
                      id="coverPicUpload"
                      className="hidden"
                      onChange={(e) => setCoverPic(e.target.files[0])}
                    />
                  </div>
                )}
              </div>

              <div className="relative">
                <img
                  src={
                    profilePic && profilePic !== user.profilePic
                      ? URL.createObjectURL(profilePic)
                      : `/personalImages/${inputs.profilePic}`
                  }
                  alt="Profile Image"
                  className="size-[150px] rounded-full shadow-md shadow-[gray] absolute bottom-0 top-0 left-0 right-0 m-auto"
                />
                {userId == user.id && (
                  <div className="absolute top-12 left-0 right-0 m-auto text-lg z-20">
                    <label
                      htmlFor="profilePicUpload"
                      className="cursor-pointer"
                    >
                      Edit <FontAwesomeIcon icon={faImage} />
                    </label>
                    <input
                      type="file"
                      id="profilePicUpload"
                      className="hidden"
                      onChange={(e) => setProfilePic(e.target.files[0])}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 shadow-md shadow-[gray] h-max min-h-[200px] rounded-lg pt-16 items-center">
                <div className="flex w-full justify-between items-center mt-10 px-4">
                  <ShareTo />
                  <div className="flex flex-col items-center justify-center w-max absolute left-0 right-0 m-auto gap-4">
                    <h1 className="text-xl text-center">{inputs.username}</h1>
                    <div className="flex gap-3 ml-5">
                      {inputs.city && (
                        <span>
                          <FontAwesomeIcon icon={faLocationDot} /> {inputs.city}
                        </span>
                      )}
                      {inputs.country && (
                        <span>
                          <FontAwesomeIcon icon={faGlobe} /> {inputs.country}
                        </span>
                      )}
                    </div>
                    {relationLoading ? (
                      <div className="loading loading-spinner"></div>
                    ) : userId == user.id ? (
                      coverPic != user.coverPic ||
                      profilePic != user.profilePic ? (
                        <button
                          className="w-[150px] py-2 text-xl text-white rounded-md bg-green-700 hover:bg-green-600 hover:scale-[1.03] transition-all"
                          onClick={handleUpdateImages}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="w-[150px] py-2 text-xl text-white rounded-md bg-[#4747ff] hover:bg-[#3e84fe] hover:scale-[1.03] transition-all"
                          onClick={() => setEditProfile(true)}
                        >
                          Update
                        </button>
                      )
                    ) : (
                      <button
                        className="w-[150px] py-2 text-xl text-white rounded-md bg-[#4747ff] hover:bg-[#3e84fe] hover:scale-[1.03] transition-all"
                        onClick={handleFollow}
                      >
                        {relationData.some(
                          (relation) => relation.followerUserId == user.id
                        )
                          ? "Following"
                          : "Follow"}
                      </button>
                    )}
                  </div>
                  {userId != user.id && (
                    <div
                      className=" cursor-pointer"
                      onClick={() => navigate(`/message/${userId}`)}
                    >
                      <FontAwesomeIcon icon={faMessage} /> Send Message
                    </div>
                  )}
                </div>
                {editProfile && (
                  <div className="absolute p-3 top-0 bottom-0 left-0 right-0 m-auto z-50 bg-[#2e2e2e] rounded-md w-full h-max">
                    <EditProfile data={data} setEditProfile={setEditProfile} />
                  </div>
                )}
              </div>
            </div>

            <RightSidebar />
          </div>
        </>
      )}
      {/* <Footer /> */}
    </div>
  );
};

/* import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext.jsx";
import axios from "axios";
import { Navbar } from "../Components/Navbar.jsx";
import toast from "react-hot-toast";
import { LeftSidebar } from "../Components/LeftSidebar.jsx";
import { RightSidebar } from "../Components/RightSidebar.jsx";
import { ShareTo } from "../Components/ShareTo.jsx";
import {
  faGlobe,
  faImage,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios.js";
import { useLocation } from "react-router-dom";
import EditProfile from "../Components/EditProfile.jsx";

export const Profile = () => {
  const { user, loading } = useContext(AuthContext);
  const [editProfile, setEditProfile] = useState(false);
  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const { isLoading, data, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await makeRequest.get(`user/find/${userId}`);
      return res.data;
    },
  });
  const [inputs, setInputs] = useState({});
  const [coverPic, setCoverPic] = useState(user.coverPic);
  const [profilePic, setProfilePic] = useState(user.profilePic);
  console.log(profilePic);
  console.log(coverPic);
  useEffect(() => {
    if (data) {
      setInputs(data);
    }
  });
  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/upload");
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  const { isLoading: relationLoading, data: relationData } = useQuery({
    queryKey: ["relationships"],
    queryFn: async () => {
      const res = await makeRequest.get(`relations?id=${userId}`);
      return res.data;
    },
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (following) => {
      if (following) {
        const res = await makeRequest.delete(`relations?userId=${userId}`);
        toast.error(res.data.message);
        return res.data;
      }
      const res = await makeRequest.post("relations", { userId });
      toast.success(res.data.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relationships"] });
    },
  });
  const handleFollow = () => {
    mutation.mutate(
      relationData?.some((relation) => relation.followerUserId == user.id)
    );
  };

  return (
    <div className=" w-ful flex flex-col">
      {isLoading ? (
        <div className="loading loading-spinner"></div>
      ) : (
        <>
          <Navbar />
          <div className="w-full grid grid-cols-4 text-center mt-5 gap-5 max-md:flex max-md:flex-col min-w-[500px]">
            <LeftSidebar />

            <div className="w-full relative flex justify-center flex-col gap-5 col-span-2">
              <div className="relative">
                <img
                  src={
                    coverPic && coverPic != user.coverPic
                      ? URL.createObjectURL(coverPic)
                      : coverPic
                  }
                  alt="Cover Image"
                  className=" w-full h-[300px] shadow-md shadow-[gray] rounded-lg"
                />
                {userId == user.id && (
                  <div className="absolute bottom-2 right-3 text-2xl">
                    <label
                      htmlFor="img"
                      className=" cursor-pointer flex gap-4 items-center"
                    >
                      Edit
                      <FontAwesomeIcon icon={faImage} className="scale-[1.5]" />
                    </label>
                    <input
                      type="file"
                      id="img"
                      className=" hidden"
                      onChange={(e) => setCoverPic(e.target.files[0])}
                    />
                  </div>
                )}
              </div>
              <div className=" relative ">
                <img
                  src={
                    profilePic && profilePic != user.profilePic
                      ? URL.createObjectURL(profilePic)
                      : profilePic
                  }
                  alt="Profile Image"
                  className="size-[150px] rounded-full shadow-md shadow-[gray] absolute bottom-0 top-0 left-0 right-0 m-auto"
                />
                {userId == user.id && (
                  <div className="absolute top-12 left-0 right-0 m-auto text-lg z-20">
                    <label htmlFor="img" className=" cursor-pointer ">
                      Edit <FontAwesomeIcon icon={faImage} />
                    </label>
                    <input
                      type="file"
                      id="img"
                      className=" hidden"
                      onChange={(e) => setProfilePic(e.target.files[0])}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4 shadow-md shadow-[gray] h-max min-h-[200px] rounded-lg pt-16 items-center">
                <div className="flex w-full justify-between items-center mt-10 px-4">
                  <ShareTo />
                  <div className="flex flex-col items-center justify-center w-max absolute left-0 right-0 m-auto gap-4">
                    <h1 className=" text-xl text-center">{inputs.username}</h1>
                    <div className="flex gap-3 ml-5">
                      {inputs.city && (
                        <span>
                          <FontAwesomeIcon icon={faLocationDot} /> {inputs.city}
                        </span>
                      )}
                      {inputs.country && (
                        <span>
                          <FontAwesomeIcon icon={faGlobe} /> {inputs.country}
                        </span>
                      )}
                    </div>
                    {relationLoading ? (
                      <div className="loading loading-spinner"> </div>
                    ) : userId == user.id ? (
                      coverPic != user.coverPic ||
                      profilePic == user.profilePic ? (
                        <button
                          className="w-[150px] py-2 text-xl text-white rounded-md bg-green-700 hover:bg-green-600 hover:scale-[1.03] transition-all"
                        
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="w-[150px] py-2 text-xl text-white rounded-md bg-[#4747ff] hover:bg-[#3e84fe] hover:scale-[1.03] transition-all"
                          onClick={() => setEditProfile(true)}
                        >
                          Update
                        </button>
                      )
                    ) : (
                      <button
                        className="w-[150px] py-2 text-xl text-white rounded-md bg-[#4747ff] hover:bg-[#3e84fe] hover:scale-[1.03] transition-all"
                        onClick={handleFollow}
                      >
                        {relationData.some(
                          (relation) => relation.followerUserId == user.id
                        )
                          ? "Following"
                          : "Follow"}
                      </button>
                    )}
                  </div>
                  <div>send Message</div>
                </div>
                {editProfile && (
                  <div className=" absolute p-3 top-0 bottom-0 left-0 right-0 m-auto z-50 bg-[#2e2e2e] rounded-md w-full h-max">
                    <EditProfile data={data} setEditProfile={setEditProfile} />
                  </div>
                )}
              </div>
            </div>

            <RightSidebar />
          </div>
        </>
      )}
  
    </div>
  );
};
 */
