import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useConversation } from "../zestand/useConversation";
import { extractTime } from "../assets/extractTime";

export const Message = ({ message }) => {
  const { user } = useContext(AuthContext);
  const { selectedUser, setSelectedUser } = useConversation();
  const fromMe = message.senderId === user.id;
  const chatClassName = fromMe ? "chat-start" : "chat-end";
  const profilePic = fromMe ? user.profilePic : selectedUser?.profilePic;
  const bubbleBgColor = fromMe ? "bg-blue-500" : "";
  const formattedTime = extractTime(message.createdAt);
  const shakeClass = message.shouldShake ? "shake" : "";
  return (
    <div className={`chat  ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full ">
          <img src={`/personalImages/${profilePic}`} alt="avatar" />
        </div>
      </div>
      <div
        className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}
      >
        {message.content}
      </div>
      <div className={`chat-footer opacity-50 text-sm flex gap-1 items-center`}>
        {formattedTime}
      </div>
    </div>
  );
};
