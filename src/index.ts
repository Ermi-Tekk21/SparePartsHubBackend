import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/data-source";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import userRoutes from "./routes/userRoutes";
import path from "path";

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", userRoutes);

app.get("/api/health", async (req, res) => {
  try {
    await AppDataSource.query("SELECT 1");
    res.status(200).json({ status: "healthy", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", database: "disconnected" });
  }
});

const startServer = async () => {
  try {
    console.log("Attempting to initialize database...");
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    console.log("Database connected");
    if (process.env.NODE_ENV !== "test") {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.log(`Swagger UI available at http://localhost:${port}/api-docs/`);
      });
    }
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

startServer();