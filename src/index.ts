import express from "express";
import { AppDataSource } from "./config/data-source";
import { User } from "./entities/User";

const app = express();
app.use(express.json());

// Health-check endpoint
app.get("/api/health", async (req, res) => {
  try {
    await AppDataSource.query("SELECT 1");
    res.status(200).json({ status: "healthy", database: "connected" });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({ status: "unhealthy", database: "disconnected" });
  }
});

// Register endpoint
app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const user = new User();
    user.name = name;
    user.email = email;
    await userRepository.save(user);
    res.status(201).json({ message: "User registered", user: { id: user.id, name, email } });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
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
      });
    })
    .catch((error) => {
      console.error("Database connection error:", error);
      process.exit(1); // Exit to make crash visible
    });
}

export default app;