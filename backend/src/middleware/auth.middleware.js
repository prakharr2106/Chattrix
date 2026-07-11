import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";

export async function protectRoute(req, res, next) {
  try {
    // Get the authenticated Clerk user ID
    const { userId } = getAuth(req);

    // Reject request if user is not authenticated
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Find the corresponding user in the database
    const user = await User.findOne({ clerkId: userId });

    // User exists in Clerk but not in the database
    if (!user) {
      res.status(404).json({ message: "User profile is not synced yet" });
      return;
    }

    // Attach user data to the request object
    req.user = user;

    // Pass control to the next middleware/route handler
    next();
  } catch (error) {
    // Handle unexpected errors
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}