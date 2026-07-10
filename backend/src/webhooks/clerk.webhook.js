import express from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/backend/webhooks";

const router = express.Router();

// Handle POST requests sent by Clerk
router.post("/", async (req, res) => {
  try {
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!signingSecret) {
      res.status(503).json({ message: "Webhook secret is not provided" });
      return;
    }

    // Express stores the raw body as a Buffer.
    // Convert it into a string because Clerk expects a Web Request object.
    const payload = Buffer.isBuffer(req.body)
      ? req.body.toString("utf8")
      : String(req.body);

    // Create a standard Web Request object for Clerk verification
    const request = new Request("http://internal/webhooks/clerk", {
      method: "POST",
      headers: new Headers(req.headers),
      body: payload,
    });

    // Verify that the request actually came from Clerk.
    // If verification fails, an error is thrown.
    const evt = await verifyWebhook(request, { signingSecret });

    // ============================
    // Handle user creation/update
    // ============================
    if (evt.type === "user.created" || evt.type === "user.updated") {
      const u = evt.data;

      // Find the user's primary email.
      // If there is no primary email, use the first available email.
      const email =
        u.email_addresses?.find((e) => e.id === u.primary_email_address_id)
          ?.email_address ?? u.email_addresses?.[0]?.email_address;

      // Create the user's display name.
      // Priority:
      // 1. First + Last name
      // 2. Username
      // 3. Part before '@' in the email
      const fullName =
        [u.first_name, u.last_name].filter(Boolean).join(" ") ||
        u.username ||
        email?.split("@")[0];

      // Update the existing user if found.
      // Otherwise create a new one (upsert = update + insert).
      await User.findOneAndUpdate(
        { clerkId: u.id }, // Search using Clerk user ID

        // Data to store in MongoDB
        {
          clerkId: u.id,
          email,
          fullName,
          profilePic: u.image_url,
        },

        {
          new: true,                // Return updated document
          upsert: true,             // Create document if it doesn't exist
          setDefaultsOnInsert: true // Apply default values when inserting
        },
      );
    }

    // ============================
    // Handle user deletion
    // ============================
    if (evt.type === "user.deleted") {
      // Delete the user from MongoDB using Clerk ID
      if (evt.data.id)
        await User.findOneAndDelete({ clerkId: evt.data.id });
    }

    // Tell Clerk the webhook was processed successfully
    res.status(200).json({ received: true });

  } catch (error) {
    // Verification failed or some other error occurred
    console.error("Error in Clerk webhook:", error);

    res.status(400).json({
      message: "Webhook verification failed",
    });
  }
});

export default router;