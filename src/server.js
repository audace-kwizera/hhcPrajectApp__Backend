require("dotenv").config();
const app = require("./app");
const http = require("http");

const PORT = process.env.PORT || 3001;

// 🔥 CREATE HTTP SERVER
const server = http.createServer(app);

// 🔥 SOCKET.IO
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ à sécuriser plus tard
  },
});

// 🔥 rendre global (simple et efficace pour maintenant)
global.io = io;

// 🔥 SOCKET EVENTS
io.on("connection", (socket) => {
  console.log("⚡ Client connecté:", socket.id);

  // 🔥 rejoindre un salon
  socket.on("joinSalon", (salon_id) => {
    socket.join(`salon_${salon_id}`);
    console.log(`Client rejoint salon_${salon_id}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client déconnecté:", socket.id);
  });
});

// 🔥 START SERVER
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket running on port ${PORT}`);
});