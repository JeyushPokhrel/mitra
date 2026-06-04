import mongoose from "mongoose";

// Team Schema
const TeamSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: String,
    lead: String,
    members: { type: Number, default: 0 },
    color: { type: String, default: "primary" },
  },
  { timestamps: true }
);

// Agent Schema
const AgentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    avatar: String,
    role: { type: String, required: true },
    team: String,
    department: String,
    timezone: String,
    status: {
      type: String,
      enum: ["online", "away", "busy", "offline"],
      default: "offline",
    },
    csat: { type: Number, default: 0 },
    resolved: { type: Number, default: 0 },
    conversations: { type: Number, default: 0 },
    responseTime: { type: String, default: "—" },
  },
  { timestamps: true }
);

// Shift Schema
const ShiftSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    agent: { type: String, required: true },
    day: { type: Number, required: true }, // 0 = Mon, 6 = Sun
    start: { type: Number, required: true }, // Hour
    end: { type: Number, required: true }, // Hour
    type: { type: String, enum: ["shift", "break"], default: "shift" },
  },
  { timestamps: true }
);

// Organization Schema
const OrganizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    domain: String,
    website: String,
    industry: String,
    employees: Number,
    timezone: String,
    region: String,
    logo: String,
    aiEnabled: { type: Boolean, default: true },
    brandColor: String,
    description: String,
    owner: String,
    plan: String,
    seats: Number,
    seatsUsed: Number,
  },
  { timestamps: true }
);

// Permission Matrix Schema
const PermissionMatrixSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, unique: true },
    permissions: {
      type: Map,
      of: [String], // maps resource name (e.g., 'Inbox') to array of permissions (e.g., ['View', 'Create'])
    },
  },
  { timestamps: true }
);

export const Team = mongoose.model("Team", TeamSchema);
export const Agent = mongoose.model("Agent", AgentSchema);
export const Shift = mongoose.model("Shift", ShiftSchema);
export const Organization = mongoose.model("Organization", OrganizationSchema);
export const PermissionMatrix = mongoose.model("PermissionMatrix", PermissionMatrixSchema);
