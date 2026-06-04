import app from "./app.js";
import connectDb from "./config/db.js";
import { seedDatabase } from "./services/seedService.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to Database (must succeed first)
    await connectDb();

    // 2. Seed Database if empty
    await seedDatabase();

    // 3. Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
    });
  } catch (error) {
    console.error("Critical: Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
