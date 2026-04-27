import { Server } from "socket.io";

let io: Server;
const userSocketMap = new Map<string, string>();

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.on("register", (userId: string) => {
      userSocketMap.set(userId, socket.id);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });
};

export const getIO = () => io;

export const getUserSocket = (userId: string) => {
  return userSocketMap.get(userId);
};