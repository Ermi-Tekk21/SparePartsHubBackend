import request from "supertest";
import { AppDataSource } from "../config/data-source";
import app from "../index";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

describe("API Endpoints", () => {
  let server: any;

  beforeAll(async () => {
    try {
      await AppDataSource.initialize();
      await AppDataSource.query("TRUNCATE TABLE user");
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
    server = app.listen(0);
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
      database: "connected",
    });
  });

  it("should register a user with full name, email, and pending status", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({ fullName: "John Doe", email: "john@example.com" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User registered, check email to complete",
      user: {
        id: expect.any(String),
        fullName: "John Doe",
        email: "john@example.com",
        status: "pending",
      },
    });
  });

  it("should fail to register a user with missing email", async () => {
    const response = await request(app)
      .post("/api/users/register")
      .send({ fullName: "John Doe" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Full name and email are required" });
  });

  it("should fail to register a user with duplicate email", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ fullName: "Jane Doe", email: "jane@example.com" });
    const response = await request(app)
      .post("/api/users/register")
      .send({ fullName: "Jane Doe", email: "jane@example.com" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Email already exists" });
  });

  it("should complete user registration with token and files", async () => {
    // First, register a user
    const registerResponse = await request(app)
      .post("/api/users/register")
      .send({ fullName: "John Doe", email: "john@example.com" });
    const userId = registerResponse.body.user.id;

    // Get the registration token from the database
    const user = await AppDataSource.getRepository("User").findOneBy({ id: userId });
    const token = user?.registrationToken;

    // Create dummy files for testing
    const dummyImagePath = path.join(__dirname, "dummy.png");
    fs.writeFileSync(dummyImagePath, "dummy content");

    // Complete registration
    const response = await request(app)
      .post("/api/users/complete-registration")
      .query({ token })
      .field("username", "johndoe")
      .field("companyName", "Doe Auto Parts")
      .field("companyDescription", "Leading supplier of car spare parts")
      .attach("companyLogo", dummyImagePath)
      .attach("digitalSignature", dummyImagePath)
      .attach("stamp", dummyImagePath);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Registration completed",
      user: {
        id: expect.any(String),
        fullName: "John Doe",
        email: "john@example.com",
        username: "johndoe",
        companyName: "Doe Auto Parts",
        companyDescription: "Leading supplier of car spare parts",
        status: "active",
      },
    });

    // Clean up dummy file
    fs.unlinkSync(dummyImagePath);
  });

  it("should fail to complete registration with invalid token", async () => {
    const response = await request(app)
      .post("/api/users/complete-registration")
      .query({ token: "invalid-token" })
      .field("username", "johndoe")
      .field("companyName", "Doe Auto Parts")
      .field("companyDescription", "Leading supplier of car spare parts");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid or expired token" });
  });

  it("should serve Swagger UI", async () => {
    const response = await request(app).get("/api-docs/");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Swagger UI");
  });
});