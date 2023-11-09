import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthResponse } from "./types/auth-response.type";
import { LoginInput, SignupInput } from "./dto";
import { UsersService } from "src/users/users.service";
import { compare } from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService
  ) { }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);
    const token = "ABC123";

    return {
      token: token,
      user: user
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(loginInput.email);

    // match password
    const passwordsMatch = await compare(loginInput.password, user.password);

    if (!passwordsMatch) {
      throw new BadRequestException("[invalid-password]");
    }

    const token = "ABC123";

    return { token, user };
  }
}
