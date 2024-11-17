import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { TiMessages } from "react-icons/ti";
import { Navbar } from "./Navbar";

export const MessageContainer = () => {
  return (
    <div className="w-full  flex flex-col gap-4">
      <NoChatSelected />
    </div>
  );
};
const NoChatSelected = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col gap-2 px-4 text-center sm:text-lg md:text-xl !text-gray-200 font-semibold items-center">
        <p>Welcome 👋 {user.username} ❄️</p>
        <p>Select a chat to start a messaging</p>
        <TiMessages className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};
