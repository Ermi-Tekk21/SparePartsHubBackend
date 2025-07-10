import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../config/data-source";
import { EmailService } from "./EmailService";
import { CloudinaryService } from "./CloudinaryService";
import { v4 as uuidv4 } from "uuid";

export class UserService {
  private userRepository: Repository<User>;
  private emailService: EmailService;
  private cloudinaryService: CloudinaryService;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.emailService = new EmailService();
    this.cloudinaryService = new CloudinaryService();
  }

  async registerUser(fullName: string, email: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
      select: ["id", "email"],
    });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const user = new User();
    user.id = uuidv4();
    user.fullName = fullName;
    user.email = email;
    user.status = "pending";
    user.registrationToken = uuidv4();

    await this.userRepository.save(user);
    await this.emailService.sendRegistrationEmail(email, user.registrationToken);
    return user;
  }

  async completeRegistration(
    token: string,
    username: string,
    companyName: string,
    companyLogo: Express.Multer.File | undefined,
    companyDescription: string,
    digitalSignature: Express.Multer.File | undefined,
    stamp: Express.Multer.File | undefined
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { registrationToken: token },
      select: ["id", "status", "registrationToken"],
    });
    if (!user) {
      throw new Error("Invalid or expired token");
    }
    if (user.status === "active") {
      throw new Error("User is already active");
    }

    if (!companyLogo || !digitalSignature || !stamp) {
      throw new Error("All files are required");
    }

    const companyLogoUrl = await this.cloudinaryService.uploadFile(companyLogo);
    const digitalSignatureUrl = await this.cloudinaryService.uploadFile(digitalSignature);
    const stampUrl = await this.cloudinaryService.uploadFile(stamp);

    user.username = username || "";
    user.companyName = companyName || "";
    user.companyDescription = companyDescription || "";
    user.companyLogo = companyLogoUrl;
    user.digitalSignature = digitalSignatureUrl;
    user.stamp = stampUrl;
    user.status = "active";
    user.registrationToken = null;

    await this.userRepository.save(user);
    return user;
  }
}