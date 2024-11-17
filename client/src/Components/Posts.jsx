import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import toast from "react-hot-toast";
import { Post } from "./Post";

export const Posts = ({ userId, search = "" }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts", userId], // Include userId in queryKey for cache consistency
    queryFn: async () => {
      const res = userId
        ? await makeRequest.get(`posts/find?userId=${userId}`)
        : await makeRequest.get(`posts`);
      return res.data;
    },
  });

  if (error) {
    toast.error(`Something went wrong: ${error.message}`);
  }

  return (
    <div className="w-full flex flex-col items-center justify-center gap-5">
      {isLoading ? (
        <div className="loading loading-spinner"></div>
      ) : error ? (
        <div>Error loading posts</div>
      ) : (
        data
          ?.filter((post) => {
            // Filter posts based on the search term (case-insensitive)
            return search.trim() === ""
              ? post
              : post.username.toUpperCase().includes(search.toUpperCase()) ||
                  post.content.toUpperCase().includes(search.toUpperCase());
          })
          .map((post) => <Post key={post.id} post={post} />)
      )}
    </div>
  );
};
