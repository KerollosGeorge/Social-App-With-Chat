import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import toast from "react-hot-toast";
import { OnlineFriends } from "./OnlineFreinds";

export const RightSidebar = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isLoading, data, error } = useQuery({
    queryKey: ["relationships", user.id],
    queryFn: async () => {
      const res = await makeRequest.get(`relations/suggestion?id=${user.id}`);
      return res.data;
    },
    enabled: !!user?.id, // Ensure query runs only if user.id is defined
  });

  const [friends, setFriends] = useState([]);

  // Update friends only when data is successfully fetched
  useEffect(() => {
    if (data && !isLoading) {
      setFriends(data);
    }
  }, [data, isLoading]);

  const handleDismiss = (id) => {
    setFriends((prev) => prev.filter((user) => user.id !== id));
  };

  const mutation = useMutation({
    mutationFn: async (userId) => {
      const res = await makeRequest.post("relations", { userId });
      return res.data; // Ensure we're getting the response
    },
    onSuccess: (data, variables) => {
      // Remove user from suggestions upon successful follow
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== variables)
      );
      // Optionally invalidate queries to fetch the latest suggestions
      queryClient.invalidateQueries({ queryKey: ["relationships", user.id] });
      toast.success("User followed successfully!");
    },
    onError: (error) => {
      console.error("Follow failed:", error);
      toast.error("Failed to follow user. Please try again.");
    },
  });

  const handleFollow = (id) => {
    mutation.mutate(id); // Pass the id to the mutation
  };

  if (isLoading) {
    return <div>Loading suggestions...</div>;
  }

  if (error) {
    return <div>Error loading suggestions: {error.message}</div>;
  }

  return (
    <div className="shadow-lg shadow-[gray] p-2">
      {friends && friends.length > 0 ? (
        <div className="p-2 flex flex-col">
          <h1 className=" text-2xl text-start">Suggestions for you</h1>
          {friends.slice(0, 5).map((friend) => (
            <div key={friend.id} className="flex justify-between items-center">
              <div className="flex p-2 items-center m-1">
                <img
                  src={`/personalImages/${friend.profilePic}`} // Corrected image path
                  alt={`${friend.username}'s profile`}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-4">
                  <h1>{friend.username}</h1>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  className="p-1 text-white rounded-md bg-[#4747ff] hover:bg-[#3e84fe] hover:scale-[1.03] transition-all"
                  onClick={() => handleFollow(friend.id)}
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? "Following..." : "Follow"}
                </button>
                <button
                  className="p-1 text-white rounded-md bg-[#fa3b3b] hover:bg-[#ff2e2e] hover:scale-[1.03] transition-all"
                  onClick={() => handleDismiss(friend.id)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No suggestions available.</div>
      )}
      <div className=" divider"></div>
      <OnlineFriends userId={user.id} />
    </div>
  );
};
