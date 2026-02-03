const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // hackathon demo ke liye OK
  },
});

// ================================
// 🔒 EPHEMERAL CHAT (NO DB STORAGE)
// ================================

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 1️⃣ Join 1-to-1 private room
  socket.on("join_match", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // 2️⃣ Send message (real-time relay only)
  socket.on("send_message", ({ roomId, message }) => {
    socket.to(roomId).emit("receive_message", {
      text: message,
      sender: socket.id,
      timestamp: new Date(),
    });
  });

  // 3️⃣ Leave chat (ephemeral clear)
  socket.on("leave_chat", (roomId) => {
    socket.leave(roomId);
    socket.emit("chat_cleared", "Chat session ended. Data cleared.");
  });

  // 4️⃣ Report user (no identity, no storage)
  socket.on("report_user", ({ roomId, reason }) => {
    console.log("🚩 User reported");
    console.log("Room:", roomId);
    console.log("Reason:", reason);
    // No DB storage – privacy first
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ================================
// 🌐 BASIC API (OPTIONAL / DEMO)
// ================================

app.get("/", (req, res) => {
  res.send("Controlled Chat Backend Running");
});

// ================================
// 🚀 SERVER START
// ================================

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});
