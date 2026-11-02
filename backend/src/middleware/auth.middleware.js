import { clerkClient, getAuth } from "@clerk/express";
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
    let user = await User.findOne({ clerkId: userId });

    // Fallback: If authenticated in Clerk but missing in MongoDB (e.g. local dev without webhooks), auto-sync from Clerk
    if (!user) {
      try {
        const clerkUser = await clerkClient.users.getUser(userId);

        if (clerkUser) {
          const email =
            clerkUser.emailAddresses?.find(
              (e) => e.id === clerkUser.primaryEmailAddressId,
            )?.emailAddress ??
            clerkUser.emailAddresses?.[0]?.emailAddress ??
            "";

          const fullName =
            [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
            clerkUser.username ||
            (email ? email.split("@")[0] : "User");

          // Match by clerkId OR email to link re-created Clerk accounts and prevent unique email duplicate key errors
          const filter = email
            ? { $or: [{ clerkId: userId }, { email }] }
            : { clerkId: userId };

          // Upsert the user profile and return the latest document
          user = await User.findOneAndUpdate(
            filter,
            {
              $set: {
                clerkId: userId,
                email,
                fullName,
                profilePic: clerkUser.imageUrl || "",
              },
            },
            {
              returnDocument: "after",
              upsert: true,
              setDefaultsOnInsert: true,
            },
          );
        }
      } catch (syncError) {
        console.error("Error auto-syncing Clerk user to MongoDB:", syncError.message);
      }
    }

    // If still not found after attempting sync
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
