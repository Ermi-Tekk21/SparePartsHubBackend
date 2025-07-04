import express from "express";
import { AppDataSource } from "./config/data-source";

const app = express();
app.use(express.json());

// Health-check endpoint
app.get("/api/health", async (req, res) => {
  try {
    await AppDataSource.query("SELECT 1"); // Simple query to test DB connection
    res.status(200).json({ status: "healthy", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", database: "disconnected" });
  }
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  AppDataSource.initialize()
    .then(() => {
      console.log("Database connected");
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Database connection error:", error);
    });
}

export default app;