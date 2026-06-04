import mongoose from "mongoose";

// Contact Schema
const ContactSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    avatar: String,
    country: { type: String, default: "India" },
    timezone: { type: String, default: "Asia/Kolkata" },
    company: String,
    companyId: String,
    designation: { type: String, default: "—" },
    source: { type: String, default: "Website" },
    tags: { type: [String], default: [] },
    notes: { type: String, default: "" },
    owner: { type: String, default: "Rohan Kapoor" },
    lifecycle: {
      type: String,
      enum: ["Subscriber", "Lead", "MQL", "SQL", "Opportunity", "Customer", "Evangelist", "Other"],
      default: "Lead",
    },
    leadScore: { type: Number, default: 50 },
    customerValue: { type: Number, default: 0 },
    sentiment: { type: String, default: "neutral" },
    churnRisk: { type: Number, default: 20 },
    lastActive: { type: String, default: "just now" },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Company Schema
const CompanySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    domain: String,
    industry: String,
    employees: Number,
    value: Number,
    owner: String,
    contactsCount: { type: Number, default: 0 },
    dealsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Deal Schema
const DealSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    contactId: String,
    contactName: String,
    company: String,
    value: { type: Number, default: 0 },
    probability: { type: Number, default: 20 },
    stage: {
      type: String,
      enum: ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"],
      default: "New",
    },
    owner: { type: String, default: "Rohan Kapoor" },
    expectedClose: { type: String, default: "30d" },
  },
  { timestamps: true }
);

export const Contact = mongoose.model("Contact", ContactSchema);
export const Company = mongoose.model("Company", CompanySchema);
export const Deal = mongoose.model("Deal", DealSchema);
