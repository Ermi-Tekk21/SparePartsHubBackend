import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";

export class HealthController {

  /**
   * @swagger
   * /api/health:
   *   get:
   *     summary: Check API and database health
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: API and database are healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: healthy
   *                 database:
   *                   type: string
   *                   example: connected
   *       500:
   *         description: Database connection failed
   */

  async check(req: Request, res: Response): Promise<void> {
    try {
      await AppDataSource.query("SELECT 1");
      res.status(200).json({ status: "healthy", database: "connected" });
    } catch (error) {
      console.error("Health check error:", error);
      res.status(500).json({ status: "unhealthy", database: "disconnected" });
    }
  }
}