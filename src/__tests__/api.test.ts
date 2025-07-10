import request from "supertest";
import { app } from "../index";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { setupTestDatabase } from "../setupTestDb";

describe("API Endpoints", () => {
  beforeAll(async () => {
    await setupTestDatabase(); // Initialize test database with schema
  });

  afterEach(async () => {
    await AppDataSource.getRepository(User).clear();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("should return status healthy and database connected", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "healthy", database: "connected" });
  });

  it("should register a user with full name, email, and pending status", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ fullName: "John Doe", email: "john@example.com" });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered, check email for token");
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.fullName).toBe("John Doe");
    expect(res.body.user.email).toBe("john@example.com");
    expect(res.body.user.status).toBe("pending");
  }, 10000);

  it("should fail to register a user with missing email", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ fullName: "John Doe" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Full name and email are required");
  });

  it("should fail to register a user with duplicate email", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ fullName: "John Doe", email: "john@example.com" });
    const res = await request(app)
      .post("/api/users/register")
      .send({ fullName: "Jane Doe", email: "john@example.com" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email already exists");
  });

  it("should complete user registration with token and files", async () => {
    const registerRes = await request(app)
      .post("/api/users/register")
      .send({ fullName: "John Doe", email: "john@example.com" });
    const userId = registerRes.body.user.id;
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    const token = user?.registrationToken || "";

    const res = await request(app)
      .post("/api/users/complete-registration")
      .field("token", token)
      .field("username", "johndoe")
      .field("companyName", "Doe Auto Parts")
      .field("companyDescription", "Leading supplier of car spare parts")
      .attach("companyLogo", Buffer.from("fake-image"), "logo.png")
      .attach("digitalSignature", Buffer.from("fake-image"), "signature.png")
      .attach("stamp", Buffer.from("fake-image"), "stamp.png");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Registration completed");
    expect(res.body.user.username).toBe("johndoe");
    expect(res.body.user.status).toBe("active");
  }, 10000);

  it("should fail to complete registration with invalid token", async () => {
    const res = await request(app)
      .post("/api/users/complete-registration")
      .field("token", "invalid-token")
      .field("username", "johndoe")
      .field("companyName", "Doe Auto Parts")
      .field("companyDescription", "Leading supplier of car spare parts")
      .attach("companyLogo", Buffer.from("fake-image"), "logo.png")
      .attach("digitalSignature", Buffer.from("fake-image"), "signature.png")
      .attach("stamp", Buffer.from("fake-image"), "stamp.png");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid or expired token");
  });

  it("should serve Swagger UI", async () => {
    const res = await request(app).get("/api-docs/");
    expect(res.status).toBe(200);
  });
});