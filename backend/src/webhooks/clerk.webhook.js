import express from "express";
import User from "../models/user.model.js";
import { verifyWebhook } from "@clerk/backend/webhooks";

const router = express.Router();

// Handle POST requests sent by Clerk
router.post("/", async (req, res) => {
  console.log("========== WEBHOOK RECEIVED ==========");

  try {
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    console.log("Signing Secret Exists:", !!signingSecret);

    if (!signingSecret) {
      console.log("Webhook secret missing!");
      return res
        .status(503)
        .json({ message: "Webhook secret is not provided" });
    }

    // Convert raw Buffer to string
    const payload = Buffer.isBuffer(req.body)
      ? req.body.toString("utf8")
      : String(req.body);

    console.log("Payload received.");

    // Create Web Request object
    const request = new Request("http://internal/webhooks/clerk", {
      method: "POST",
      headers: new Headers(req.headers),
      body: payload,
    });

    console.log("Verifying webhook...");

    // Verify Clerk signature
    const evt = await verifyWebhook(request, { signingSecret });

    console.log("Webhook verified successfully!");
    console.log("Event Type:", evt.type);

    // ============================
    // Handle user creation/update
    // ============================
    if (evt.type === "user.created" || evt.type === "user.updated") {
      console.log("Processing user create/update...");

      const u = evt.data;

      const email =
        u.email_addresses?.find((e) => e.id === u.primary_email_address_id)
          ?.email_address ?? u.email_addresses?.[0]?.email_address;

      const fullName =
        [u.first_name, u.last_name].filter(Boolean).join(" ") ||
        u.username ||
        email?.split("@")[0];

      console.log("User Data:");
      console.log({
        clerkId: u.id,
        email,
        fullName,
        profilePic: u.image_url,
      });

      const savedUser = await User.findOneAndUpdate(
        { clerkId: u.id },
        {
          clerkId: u.id,
          email,
          fullName,
          profilePic: u.image_url,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );

      console.log("User saved to MongoDB:");
      console.log(savedUser);
    }

    // ============================
    // Handle user deletion
    // ============================
    if (evt.type === "user.deleted") {
      console.log("Processing user deletion...");

      if (evt.data.id) {
        const deletedUser = await User.findOneAndDelete({
          clerkId: evt.data.id,
        });

        console.log("Deleted user:");
        console.log(deletedUser);
      }
    }

    console.log("Webhook completed successfully.");
    console.log("=====================================");

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("========== WEBHOOK ERROR ==========");
    console.error(error);
    console.error("===================================");

    res.status(400).json({
      message: "Webhook verification failed",
    });
  }
});

export default router;
