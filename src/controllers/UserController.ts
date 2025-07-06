import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private userService = new UserService();

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