import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USER || "spareparts_user",
  password: process.env.DATABASE_PASSWORD || "db_secure_21",
  database: process.env.DATABASE_NAME || "car_proforma_db",
  synchronize: true, // Set to false in production
  logging: false,
  entities: [],
  migrations: [],
  subscribers: []
});