import "../index.css";
import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "../Components/Navbar";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { Message } from "../Components/Message";
import { BsSend } from "react-icons/bs";
import { useConversation } from "../zestand/useConversation";

export const Chat = () => {
  const location = useLocation();
  const chatId = location.pathname.split("/")[2];
  const { selectedUser, setSelectedUser } = useConversation();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/user/find/${chatId}`);
        setSelectedUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error);
      }
    };
    if (chatId) {
      fetchUser();
    }
  }, [chatId]);
  const { data } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const res = await makeRequest.get(`messages/${chatId}`);
      return res.data;
    },
  });

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [data]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (message) => {
      return makeRequest.post(`messages/${chatId}`, { content: message });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    setLoading(true);
    mutation.mutate(message);
    setLoading(false);
    setMessage("");
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 bg-no-repeat bg-cover bg-center h-[100vh]">
      <Navbar />
      <div className=" max-w-[700px] sm:w-[450px] md:w-[550px] min-w-[400px] h-[85%] flex flex-col rounded-lg shadow-lg shadow-[gray]  overflow-hidden !bg-gray-400 !bg-clip-padding !backdrop-filter !backdrop-blur-lg !bg-opacity-0">
        <nav className="h-10">
          {selectedUser && (
            <div className="flex gap-2 m-2 items-center justify-start">
              <img
                src={`/personalImages/${selectedUser.profilePic}`}
                alt={selectedUser.username}
                className="size-12 rounded-full"
              />
              <p className=" text-lg">{selectedUser.username}</p>
            </div>
          )}
        </nav>
        <div className="divider divider-primary w-full"></div>
        <div className="px-4 flex-1 overflow-auto scrollbar-custom">
          {data?.length > 0 ? (
            data.map((m) => {
              return (
                <div key={m._id} ref={lastMessageRef}>
                  <Message message={m} />
                </div>
              );
            })
          ) : (
            <div className="w-full flex justify-center ">
              Start The Conversation Now!
            </div>
          )}
        </div>
        <form className="px-4 my-3 w-full" onSubmit={handleSubmit}>
          <div className="w-full relative">
            <input
              type="text"
              className="border text-sm rounded-lg outline-none block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
              placeholder="send a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className=" absolute inset-y-0 end-0 flex items-center pe-3">
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                message && <BsSend />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
