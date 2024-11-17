import {
  faFileText,
  faImage,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { makeRequest } from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const EditPost = ({ data, setEditPost }) => {
  const [content, setContent] = useState(data.content);
  const [image, setImage] = useState(data.img);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (editPost) => {
      const res = await makeRequest.put(`posts?postId=${data.id}`, editPost);
      toast.success(res.data.message);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!content) {
      toast.error("Please write something in the post");
      return;
    }

    if (content === data.content && image === data.img) {
      toast.error("No changes were made");
      return;
    }

    let imgUrl = image;
    if (image && image !== data.img) {
      imgUrl = await upload();
    }

    mutation.mutate({ content, img: imgUrl });
    setContent("");
    setImage(null);
    setEditPost(false); // Close the edit modal or component
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex justify-between items-center">
        <h2 className=" w-full text-center text-2xl">Edit Profile</h2>
        <span onClick={() => setEditPost(false)}>
          <FontAwesomeIcon
            icon={faXmark}
            className=" size-6  text-red-500 cursor-pointer hover:scale-[1.1] transition-all hover:text-red-600"
          />
        </span>
      </div>
      <form className="flex flex-col gap-3 ">
        <div className="relative">
          <img
            src={
              image === data.img
                ? `./upload/${image}`
                : URL.createObjectURL(image)
            }
            alt="Post Image"
            className=" h-[300px] shadow-md shadow-[gray] rounded-md w-full"
          />

          <div className="absolute bottom-1 right-1 m-auto text-2xl z-20">
            <label htmlFor="profilePicUpload" className="cursor-pointer">
              Edit <FontAwesomeIcon icon={faImage} />
            </label>
            <input
              type="file"
              id="profilePicUpload"
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
        </div>
        <label className="input input-bordered bg-transparent flex items-center gap-2">
          <FontAwesomeIcon icon={faFileText} />
          <input
            type="text"
            className="grow"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        <button
          className="btn btn-primary text-lg w-[200px] self-center"
          onClick={handleEdit}
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditPost;
