import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import userRoutes from "./routes/userRoutes";
import healthRoutes from "./routes/healthRoutes";
import { AppDataSource } from "./config/data-source";
import path from "path";

const app = express();
app.use(express.json());
// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/health", healthRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Serve registration form for GET /api/users/complete-registration
app.get("/api/users/complete-registration", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/complete-registration.html"));
});

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
        console.log(`Registration form available at http://localhost:${PORT}/api/users/complete-registration`);
      });
    })
    .catch((error) => {
      console.error("Database connection error:", error);
      process.exit(1);
    });
}

export default app;