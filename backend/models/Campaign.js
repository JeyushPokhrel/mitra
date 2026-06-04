import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    channel: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Scheduled", "Completed"],
      default: "Scheduled",
    },
    sent: {
      type: Number,
      default: 0,
    },
    opened: {
      type: String,
      default: "—",
    },
    clicked: {
      type: String,
      default: "—",
    },
  },
  {
    timestamps: true,
  }
);

const Campaign = mongoose.model("Campaign", CampaignSchema);
export default Campaign;
