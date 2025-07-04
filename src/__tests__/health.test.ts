import request from "supertest";
import { AppDataSource } from "../config/data-source";
import app from "../index";

describe("Health Check Endpoint", () => {
  let server: any;

  beforeAll(async () => {
    await AppDataSource.initialize();
    server = app.listen(0); // Use random port to avoid conflicts
  });

  afterAll(async () => {
    await AppDataSource.destroy();
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
});