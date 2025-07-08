import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { v4 as uuidv4 } from "uuid";
import { EmailService } from "./EmailService";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private emailService = new EmailService();

  async registerUser(fullName: string, email: string): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const user = new User();
    user.fullName = fullName;
    user.email = email;
    user.status = "pending";
    user.registrationToken = uuidv4();
    const savedUser = await this.userRepository.save(user);
    await this.emailService.sendRegistrationEmail(email, user.registrationToken);
    return savedUser;
  }

  async completeRegistration(
    token: string,
    username: string,
    companyName: string,
    companyLogo: string,
    companyDescription: string,
    digitalSignature: string,
    stamp: string
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ registrationToken: token });
    if (!user) {
      throw new Error("Invalid or expired token");
    }
    if (user.status === "active") {
      throw new Error("User already active");
    }
    user.username = username;
    user.companyName = companyName;
    user.companyLogo = companyLogo;
    user.companyDescription = companyDescription;
    user.digitalSignature = digitalSignature;
    user.stamp = stamp;
    user.status = "active";
    user.registrationToken = null; // Clear token
    return await this.userRepository.save(user);
  }
}