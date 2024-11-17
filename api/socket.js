import { Server } from "socket.io";

let onlineUsers = new Map(); // { userId: socketId }

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust to your frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // Handle user coming online
    socket.on("userOnline", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    // Handle user disconnecting
    socket.on("disconnect", () => {
      const userId = [...onlineUsers.entries()].find(
        ([, id]) => id === socket.id
      )?.[0];
      if (userId) {
        onlineUsers.delete(userId);
      }
    });
  });
};

export const getOnlineUsers = () => {
  return onlineUsers;
};
