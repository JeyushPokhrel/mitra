import mongoose from "mongoose";

const TicketMessageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  author: { type: String, required: true },
  body: { type: String, required: true },
  time: { type: String, required: true },
  internal: { type: Boolean, default: false },
});

const AuditEntrySchema = new mongoose.Schema({
  id: { type: String, required: true },
  time: { type: String, required: true },
  actor: { type: String, required: true },
  action: { type: String, required: true },
});

const AttachmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: String, required: true },
  url: String,
});

const TicketSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["New", "Open", "Pending", "Waiting Customer", "Escalated", "Resolved", "Closed"],
      default: "New",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent", "Critical"],
      default: "Medium",
    },
    category: {
      type: String,
      enum: ["Billing", "Technical", "Account", "Bug", "Feature Request", "General"],
      default: "General",
    },
    assignee: {
      type: String,
      default: null,
    },
    collaborators: {
      type: [String],
      default: [],
    },
    organization: {
      type: String,
      default: "—",
    },
    customer: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    channel: {
      type: String,
      enum: ["Email", "Chat", "WhatsApp", "Phone", "Web"],
      default: "Web",
    },
    sla: {
      responseDue: { type: Number, default: 240 },
      resolutionDue: { type: Number, default: 1440 },
      responded: { type: Boolean, default: false },
      breached: { type: Boolean, default: false },
    },
    dueAt: {
      type: String,
      default: "in 4h",
    },
    tags: {
      type: [String],
      default: [],
    },
    messages: [TicketMessageSchema],
    audit: [AuditEntrySchema],
    attachments: [AttachmentSchema],
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
