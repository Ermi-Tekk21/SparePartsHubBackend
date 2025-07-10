import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "3306"),
  username: process.env.DATABASE_USER || "spareparts_user",
  password: process.env.DATABASE_PASSWORD || "your_password",
  database: process.env.NODE_ENV === "test" ? "car_proforma_test_db" : "car_proforma_db",
  entities: [User],
  synchronize: process.env.NODE_ENV === "test" ? false : true, // Always false; use migrations for schema changes
  logging: process.env.NODE_ENV === "test" ? true : false,
  dropSchema: process.env.NODE_ENV === "test" ? true : false, // Reset schema in tests
});