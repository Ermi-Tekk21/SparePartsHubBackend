import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import userRoutes from "./routes/userRoutes";
import healthRoutes from "./routes/healthRoutes";
import { AppDataSource } from "./config/data-source";

const app = express();
app.use(express.json());

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/health", healthRoutes);
// Serve Swagger UI without redirect
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Start server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  console.log("Attempting to initialize database...");
  AppDataSource.initialize()
    .then(() => {
      console.log("Database connected");
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Swagger UI available at http://localhost:${PORT}/api-docs/`);
      });
    })
    .catch((error) => {
      console.error("Database connection error:", error);
      process.exit(1);
    });
}

export default app;