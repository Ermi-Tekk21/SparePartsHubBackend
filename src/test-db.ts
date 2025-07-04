import { AppDataSource } from "./config/data-source";

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected");
    await AppDataSource.query("SELECT 1");
    console.log("Query successful");
    await AppDataSource.destroy();
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
