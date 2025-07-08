import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private userService = new UserService();

  /**
   * @swagger
   * /api/users/register:
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
   *         description: User registered, check email to complete
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
        message: "User registered, check email to complete",
        user: { id: user.id, fullName, email, status: user.status },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Failed to register user" });
    }
  }

  /**
   * @swagger
   * /api/users/complete-registration:
   *   post:
   *     summary: Complete user registration
   *     tags: [Users]
   *     consumes:
   *       - multipart/form-data
   *     parameters:
   *       - in: query
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: Registration token from email
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - companyName
   *               - companyLogo
   *               - companyDescription
   *               - digitalSignature
   *               - stamp
   *             properties:
   *               username:
   *                 type: string
   *                 example: johndoe
   *               companyName:
   *                 type: string
   *                 example: Doe Auto Parts
   *               companyLogo:
   *                 type: file
   *                 description: Company logo (JPEG/PNG)
   *               companyDescription:
   *                 type: string
   *                 example: Leading supplier of car spare parts
   *               digitalSignature:
   *                 type: file
   *                 description: Digital signature image (JPEG/PNG)
   *               stamp:
   *                 type: file
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
      const { token } = req.query;
      const { username, companyName, companyDescription } = req.body;
      const { companyLogo, digitalSignature, stamp } = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      if (
        !token ||
        !username ||
        !companyName ||
        !companyDescription ||
        !companyLogo?.[0]?.path ||
        !digitalSignature?.[0]?.path ||
        !stamp?.[0]?.path
      ) {
        res.status(400).json({ error: "All fields and files are required" });
        return;
      }
      const user = await this.userService.completeRegistration(
        token as string,
        username,
        companyName,
        companyLogo[0].path,
        companyDescription,
        digitalSignature[0].path,
        stamp[0].path
      );
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