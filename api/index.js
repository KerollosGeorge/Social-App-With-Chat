import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import storyRoutes from "./routes/stories.js";
import messageRoutes from "./routes/message.js";
import { setupSocket } from "./socket.js"; // Import socket setup
import { getOnlineFriends } from "./getOnlineFreinds.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup Socket.io
setupSocket(server);

// Middleware setup
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Upload API routes
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

// Other routes and middleware setup...
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relations", relationshipRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/messages", messageRoutes);

// Get online friends API
app.get("/api/online-friends", getOnlineFriends);

app.get("/", (req, res) => {
  res.send("Hello From Backend");
});

// Start server on specified port
const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server running on port ${port}`));
