import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private userService = new UserService();

  /**
   * @swagger
   * /users/register:
   *   post:
   *     summary: Register a new user (pending status)
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fullName
   *               - email
   *             properties:
   *               fullName:
   *                 type: string
   *                 example: John Doe
   *               email:
   *                 type: string
   *                 example: john@example.com
   *     responses:
   *       201:
   *         description: User registered, check email for token
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
   *                     fullName:
   *                       type: string
   *                     email:
   *                       type: string
   *                     status:
   *                       type: string
   *       400:
   *         description: Invalid input or email already exists
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { fullName, email } = req.body;
      if (!fullName || !email) {
        res.status(400).json({ error: "Full name and email are required" });
        return;
      }
      const user = await this.userService.registerUser(fullName, email);
      res.status(201).json({
        message: "User registered, check email for token",
        user: { id: user.id, fullName, email, status: user.status },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to register user" });
    }
  }

  /**
   * @swagger
   * /users/complete-registration:
   *   post:
   *     summary: Complete user registration
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - token
   *               - username
   *               - companyName
   *               - companyLogo
   *               - companyDescription
   *               - digitalSignature
   *               - stamp
   *             properties:
   *               token:
   *                 type: string
   *                 example: bcec0bc2-56fe-47d6-b11e-95d7e085b0ca
   *               username:
   *                 type: string
   *                 example: johndoe
   *               companyName:
   *                 type: string
   *                 example: Doe Auto Parts
   *               companyLogo:
   *                 type: string
   *                 format: binary
   *                 description: Company logo (JPEG/PNG)
   *               companyDescription:
   *                 type: string
   *                 example: Leading supplier of car spare parts
   *               digitalSignature:
   *                 type: string
   *                 format: binary
   *                 description: Digital signature image (JPEG/PNG)
   *               stamp:
   *                 type: string
   *                 format: binary
   *                 description: Company stamp image (JPEG/PNG)
   *     responses:
   *       200:
   *         description: Registration completed
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
   *                     fullName:
   *                       type: string
   *                     email:
   *                       type: string
   *                     username:
   *                       type: string
   *                     companyName:
   *                       type: string
   *                     companyDescription:
   *                       type: string
   *                     status:
   *                       type: string
   *       400:
   *         description: Invalid token or user already active
   */
  async completeRegistration(req: Request, res: Response): Promise<void> {
    try {
      const { token, username, companyName, companyDescription } = req.body;
      const { companyLogo, digitalSignature, stamp } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const user = await this.userService.completeRegistration(
        token,
        username || "",
        companyName || "",
        companyLogo?.[0],
        companyDescription || "",
        digitalSignature?.[0],
        stamp?.[0]
      );
      if (!user) {
        res.status(400).json({ error: "Invalid or expired token" });
        return;
      }

      if (
        !username ||
        !companyName ||
        !companyDescription ||
        !companyLogo?.[0] ||
        !digitalSignature?.[0] ||
        !stamp?.[0]
      ) {
        res.status(400).json({ error: "All fields and files are required" });
        return;
      }

      res.status(200).json({
        message: "Registration completed",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          username: user.username,
          companyName: user.companyName,
          companyDescription: user.companyDescription,
          status: user.status,
        },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to complete registration" });
    }
  }
}