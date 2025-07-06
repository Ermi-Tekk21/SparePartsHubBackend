import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async registerUser(name: string, email: string): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const user = new User();
    user.name = name;
    user.email = email;
    return await this.userRepository.save(user);
  }
}