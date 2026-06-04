import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    device: {
      type: String,
      enum: ["Desktop", "Mobile", "Tablet"],
      required: true,
    },
    os: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
      required: true,
    },
    screen: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    currentPage: {
      type: String,
      required: true,
    },
    pagesVisited: {
      type: Number,
      default: 1,
    },
    sessionSeconds: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "idle", "leaving"],
      default: "active",
    },
    leadScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    intent: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    conversionProbability: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    vip: {
      type: Boolean,
      default: false,
    },
    returning: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Visitor = mongoose.model("Visitor", VisitorSchema);
export default Visitor;
