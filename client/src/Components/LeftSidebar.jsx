import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { makeRequest } from "../axios";
import { useNavigate } from "react-router-dom";

export const LeftSidebar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { isLoading, data, error } = useQuery({
    queryKey: ["relationships"],
    queryFn: async () => {
      const res = await makeRequest.get(`relations?id=${user.id}`);
      return res.data;
    },
    enabled: !!user?.id, // Ensure query runs only if user.id is defined
  });

  return (
    <>
      {isLoading ? (
        <div className=" loading-spinner"></div>
      ) : (
        <div className="shadow-lg shadow-[gray] p-2">
          {data && data.length > 0 ? (
            <div className="p-2 flex flex-col">
              <h1 className="text-2xl text-start">Followers</h1>
              {data.map((friend) => (
                <div
                  key={friend.followerUserId}
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => navigate(`/profile/${friend.followerUserId}}`)}
                >
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
                </div>
              ))}
            </div>
          ) : (
            <div>No Followers available.</div>
          )}
        </div>
      )}
    </>
  );
};
