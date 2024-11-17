import Image from "../assets/img.png";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import toast from "react-hot-toast";

export const Share = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading, data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await makeRequest.get(`user/find/${user.id}`);
      return res.data;
    },
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post("posts", newPost);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleShare = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (!content) {
      toast.error("write your post");
      return;
    } else {
      if (file) {
        imgUrl = await upload();
      }
      mutation.mutate({ content, img: imgUrl });
      setContent("");
      setFile(null);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="loading loading-spinner"></div>
      ) : (
        <div className="w-full flex flex-col shadow-md shadow-[gray] p-7 gap-4 rounded-lg">
          <div className="w-full flex justify-between items-center gap-3">
            <div className="flex w-full gap-2 items-center">
              <img
                src={`/personalImages/${data.profilePic}`}
                alt="profile"
                className="size-[50px] rounded-full bg-slate-400"
              />
              <input
                type="text"
                placeholder={`What's in your mind ${data.username}`}
                className="input input-bordered bg-transparent w-full h-[50px] "
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="w-[200px] h-[100px]"
              />
            )}
          </div>
          <div className="w-full flex justify-between">
            <div className="flex gap-1 items-center justify-center cursor-pointer">
              <img src={Image} className=" size-5" />
              <label htmlFor="img" className="cursor-pointer">
                Add Image
              </label>
              <input
                type="file"
                id="img"
                className=" hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <button className="btn btn-primary w-[100px]" onClick={handleShare}>
              Share
            </button>
          </div>
        </div>
      )}
    </>
  );
};
