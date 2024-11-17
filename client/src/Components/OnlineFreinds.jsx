import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:4000/"); // Replace with your backend URL

export const OnlineFriends = ({ userId }) => {
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    // Notify the server that the user is online
    socket.emit("userOnline", userId);

    // Fetch online friends when the component mounts
    const fetchOnlineFriends = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/online-friends?id=${userId}`
        );
        setOnlineFriends(response.data);
      } catch (error) {
        console.error("Error fetching online friends:", error);
      }
    };

    fetchOnlineFriends();

    // Handle component unmount or socket disconnect
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <div className="w-full m-2 flex flex-col justify-start">
      <h3 className="text-start text-2xl">Online Friends</h3>

      <ul>
        {onlineFriends.map((friend) => (
          <div className="flex p-2 items-center m-1">
            <div className="avatar online w-10 h-10 rounded-ful">
              <img
                src={`/personalImages/${friend.profilePic}`} // Corrected image path
                alt={`${friend.username}'s profile`}
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div className="ml-4">
              <h1>{friend.username}</h1>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};
