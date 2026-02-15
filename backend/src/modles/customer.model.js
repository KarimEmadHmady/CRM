import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        name: { type: String, trim: true, required: true },
        email: { type: String, trim: true, required: true, unique: true },
        phone: { type: String, trim: true },
        address: { type: String, trim: true },
        category: { 
            type: String, 
            trim: true, 
            required: true 
        },
        status: { 
            type: String, 
            enum: ['interested', 'not_interested', 'subscribed', 'expired'], 
            default: 'interested' 
        },
        notes: { type: String, trim: true, default: "" },
        lastContactDate: { type: Date },
        totalSpent: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);
