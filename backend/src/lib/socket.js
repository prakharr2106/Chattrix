import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Allow requests only from the frontend URL
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: { origin: [allowedOrigin] },
});

// Return the socket ID of a specific user
function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Stores online users as { userId: socketId }
const userSocketMap = {};

io.on("connection", (socket) => {
  // Get the user ID sent during the Socket.IO handshake
  const userId = socket.handshake.query.userId;

  // Save the user's socket ID if authenticated
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Broadcast the updated list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for client disconnection
  socket.on("disconnect", () => {
    // Remove the user from the online users map
    if (userId) {
      delete userSocketMap[userId];
    }

    // Broadcast the updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io, getReceiverSocketId };
