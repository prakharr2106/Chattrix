import express from "express";
import {
  getConversationsForSidebar,
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protectRoute);

// Get all users for the sidebar
router.get("/users", getUsersForSidebar);

// Get all conversations of the logged-in user
router.get("/conversations", getConversationsForSidebar);

// Get messages for a specific conversation/user
router.get("/:id", getMessages);

// Send a message (with optional media upload)
router.post("/send/:id", upload.single("media"), sendMessage);

export default router;
