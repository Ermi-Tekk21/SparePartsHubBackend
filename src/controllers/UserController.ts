import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private userService = new UserService();

  /**
   * @swagger
   * /api/users/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *             properties:
   *               name:
   *                 type: string
   *                 example: John Doe
   *               email:
   *                 type: string
   *                 example: john@example.com
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     name:
   *                       type: string
   *                     email:
   *                       type: string
   *       400:
   *         description: Invalid input or email already exists
   */

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        res.status(400).json({ error: "Name and email are required" });
        return;
      }
      const user = await this.userService.registerUser(name, email);
      res.status(201).json({ message: "User registered", user: { id: user.id, name, email } });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to register user" });
    }
  }
}