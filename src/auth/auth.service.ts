import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";
import { AuthResponse } from "./types/auth-response.type";
import { LoginInput, SignupInput } from "./dto";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);
    const token = this.getJwtToken(user.id);

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

    const token = this.getJwtToken(user.id);

    return { token, user };
  }

  async revalidateToken(user: User): Promise<AuthResponse> {
    const token = this.getJwtToken(user.id);

    return { token, user };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);

    if (user.isActive === false) {
      throw new UnauthorizedException("[inactive-user]");
    }

    delete user.password;
    return user;
  }
}
