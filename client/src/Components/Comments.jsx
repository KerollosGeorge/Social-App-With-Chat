import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import moment from "moment";
import toast from "react-hot-toast";

export const Comments = ({ post }) => {
  const postId = post.id;
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await makeRequest.get(`comments?postId=${postId}`);
      return res.data;
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (comment) => {
      return makeRequest.post(`comments?postId=${postId}`, comment);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content || content == "") {
      toast.error("comment must not be empty");
      return;
    }
    mutation.mutate({ content });
    setContent("");
  };
  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex w-full justify-between items-center gap-5">
        <div className="flex gap-2 w-full">
          <img
            className="size-[40px] rounded-full"
            src={user.profilePic}
            alt="profilePic"
          />
          <label className="input input-bordered bg-transparent flex items-center gap-2 w-full h-[40px]">
            <input
              type="text"
              className="grow"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a Comment"
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
        </div>
        <button className="btn btn-primary w-[100px]" onClick={handleSend}>
          Send
        </button>
      </div>
      <div className="w-full flex flex-col gap-5">
        {isLoading ? (
          <div className="loading loading-spinner"></div>
        ) : error ? (
          <div>{error.response.data.Error}</div>
        ) : (
          data?.length > 0 &&
          data.map((comment) => (
            <div
              key={comment.id}
              className="flex w-full gap-4 justify-between "
            >
              <div className="flex gap-2 items-center">
                <img
                  className="size-[40px] rounded-full"
                  src={comment.profilePic}
                  alt="commentProfilePic"
                />
                <div className="flex flex-col items-start">
                  <p className="text-lg">{comment.username}</p>
                  <p className="text-sm ml-2">{comment.content}</p>
                </div>
              </div>
              <span>{moment(comment.createdAt).fromNow()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
