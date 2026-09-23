import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../modles/user.model.js";

// Credentials come from environment variables (see backend/.env), never hardcoded here.
const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME || "admin";
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;

const ADMIN_PERMISSIONS = [
    "customer_read", "customer_write", "customer_delete",
    "subscription_read", "subscription_write", "subscription_delete",
    "notification_read", "notification_write", "notification_delete",
    "email_campaign_read", "email_campaign_write", "email_campaign_delete",
    "stats_view", "user_management"
];

const run = async () => {
    let exitCode = 0;

    try {
        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error(
                "Missing SEED_ADMIN_EMAIL and/or SEED_ADMIN_PASSWORD environment variables. " +
                "Set them in backend/.env before running this script."
            );
        }

        await connectDB();

        const existingByEmail = await User.findOne({ email: ADMIN_EMAIL });
        const existingByUsername = await User.findOne({ username: ADMIN_USERNAME });

        if (existingByUsername && (!existingByEmail || existingByUsername._id.toString() !== existingByEmail._id.toString())) {
            throw new Error(
                `Username "${ADMIN_USERNAME}" is already taken by a different account (${existingByUsername.email}). ` +
                "Set SEED_ADMIN_USERNAME to a different value."
            );
        }

        if (existingByEmail) {
            existingByEmail.username = ADMIN_USERNAME;
            existingByEmail.password = ADMIN_PASSWORD;
            existingByEmail.role = "admin";
            existingByEmail.permissions = ADMIN_PERMISSIONS;
            existingByEmail.isActive = true;
            await existingByEmail.save();
            console.log("Admin user updated:", existingByEmail.email);
        } else {
            const admin = new User({
                username: ADMIN_USERNAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                role: "admin",
                permissions: ADMIN_PERMISSIONS,
                isActive: true
            });
            await admin.save();
            console.log("Admin user created:", admin.email);
        }
    } catch (error) {
        console.error("Seed admin error:", error.message);
        exitCode = 1;
    } finally {
        await mongoose.disconnect();
        process.exit(exitCode);
    }
};

run();
