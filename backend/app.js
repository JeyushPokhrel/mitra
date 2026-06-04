import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import middlewares
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import workforceRoutes from "./routes/workforceRoutes.js";
import integrationRoutes from "./routes/integrationRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import crmRoutes from "./routes/crmRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";

dotenv.config();

const app = express();

// Enable CORS for frontend
app.use(cors({
  origin: "*", // Allow all origins for simplicity in development and deployment, or configure explicitly
  credentials: true,
}));

app.use(express.json());

// Routes mapping
app.use("/api/auth", authRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/workforce", workforceRoutes);
app.use("/api/integrations", integrationRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/crm", crmRoutes);
app.use("/api/conversations", conversationRoutes);

// Root route check
app.get("/", (req, res) => {
  res.json({ message: "MITRA API Server is running." });
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
