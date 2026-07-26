import "dotenv/config";

import mongoose from "mongoose";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

// Sample users to populate the database
const seedUsers = [
  [
    "seed_aarav_sharma",
    "Aarav Sharma",
    "aarav.sharma@example.com",
    "https://i.pravatar.cc/150?img=1",
  ],
  [
    "seed_vihaan_patel",
    "Vihaan Patel",
    "vihaan.patel@example.com",
    "https://i.pravatar.cc/150?img=2",
  ],
  [
    "seed_armaan_singh",
    "Armaan Singh",
    "armaan.singh@example.com",
    "https://i.pravatar.cc/150?img=3",
  ],
  [
    "seed_ananya_gupta",
    "Ananya Gupta",
    "ananya.gupta@example.com",
    "https://i.pravatar.cc/150?img=4",
  ],
  [
    "seed_priya_verma",
    "Priya Verma",
    "priya.verma@example.com",
    "https://i.pravatar.cc/150?img=5",
  ],
  [
    "seed_rohan_mehta",
    "Rohan Mehta",
    "rohan.mehta@example.com",
    "https://i.pravatar.cc/150?img=6",
  ],
  [
    "seed_kavya_iyer",
    "Kavya Iyer",
    "kavya.iyer@example.com",
    "https://i.pravatar.cc/150?img=7",
  ],
  [
    "seed_aditya_nair",
    "Aditya Nair",
    "aditya.nair@example.com",
    "https://i.pravatar.cc/150?img=8",
  ],
  [
    "seed_neha_reddy",
    "Neha Reddy",
    "neha.reddy@example.com",
    "https://i.pravatar.cc/150?img=9",
  ],
  [
    "seed_ishaan_malhotra",
    "Ishaan Malhotra",
    "ishaan.malhotra@example.com",
    "https://i.pravatar.cc/150?img=10",
  ],
  [
    "seed_meera_joshi",
    "Meera Joshi",
    "meera.joshi@example.com",
    "https://i.pravatar.cc/150?img=11",
  ],
  [
    "seed_krishna_yadav",
    "Krishna Yadav",
    "krishna.yadav@example.com",
    "https://i.pravatar.cc/150?img=12",
  ],
  [
    "seed_saanvi_kapoor",
    "Saanvi Kapoor",
    "saanvi.kapoor@example.com",
    "https://i.pravatar.cc/150?img=13",
  ],
  [
    "seed_rahul_chauhan",
    "Rahul Chauhan",
    "rahul.chauhan@example.com",
    "https://i.pravatar.cc/150?img=14",
  ],
  [
    "seed_diya_agarwal",
    "Diya Agarwal",
    "diya.agarwal@example.com",
    "https://i.pravatar.cc/150?img=15",
  ],
  [
    "seed_ayush_mishra",
    "Ayush Mishra",
    "ayush.mishra@example.com",
    "https://i.pravatar.cc/150?img=16",
  ],
  [
    "seed_nisha_saxena",
    "Nisha Saxena",
    "nisha.saxena@example.com",
    "https://i.pravatar.cc/150?img=17",
  ],
  [
    "seed_karan_bansal",
    "Karan Bansal",
    "karan.bansal@example.com",
    "https://i.pravatar.cc/150?img=18",
  ],
  [
    "seed_simran_kaur",
    "Simran Kaur",
    "simran.kaur@example.com",
    "https://i.pravatar.cc/150?img=19",
  ],
  [
    "seed_ritika_shukla",
    "Ritika Shukla",
    "ritika.shukla@example.com",
    "https://i.pravatar.cc/150?img=20",
  ],
];

async function seedDatabase() {
  // Connect to MongoDB
  await connectDB();

  // Insert new users or update existing ones
  const result = await User.bulkWrite(
    seedUsers.map(([clerkId, fullName, email, profilePic]) => ({
      updateOne: {
        // Match user by Clerk ID
        filter: { clerkId },

        // Update user details
        update: {
          $set: { clerkId, fullName, email, profilePic },
        },

        // Create user if it doesn't already exist
        upsert: true,
      },
    })),
  );

  // Display seeding summary
  console.log(
    `Seeded users. Inserted: ${result.upsertedCount}, updated: ${result.modifiedCount}, matched: ${result.matchedCount}`,
  );
}

// Run the seeding script
seedDatabase()
  .catch((error) => {
    // Handle any errors during seeding
    console.error("Failed to seed users:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    // Close the database connection
    await mongoose.connection.close();
  });
