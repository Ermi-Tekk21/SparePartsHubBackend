import request from "supertest";
import { AppDataSource } from "../config/data-source";
import app from "../index";

describe("API Endpoints", () => {
  let server: any;

  beforeAll(async () => {
    try {
      await AppDataSource.initialize();
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
    server = app.listen(0); // Use random port
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    server.close();
  });

  it("should return status healthy and database connected", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "healthy",
      database: "connected"
    });
  });

  it("should register a user with name and email", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({ name: "John Doe", email: "john@example.com" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User registered",
      user: {
        id: expect.any(String),
        name: "John Doe",
        email: "john@example.com"
      }
    });
  });

  it("should fail to register a user with missing email", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({ name: "John Doe" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Name and email are required" });
  });

  it("should fail to register a user with duplicate email", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ name: "Jane Doe", email: "jane@example.com" });
    const response = await request(app)
      .post("/api/users/register")
      .send({ name: "Jane Doe", email: "jane@example.com" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Email already exists" });
  });
});