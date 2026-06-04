import mongoose from "mongoose";

const IntegrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    desc: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
    connected: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Integration = mongoose.model("Integration", IntegrationSchema);
export default Integration;
