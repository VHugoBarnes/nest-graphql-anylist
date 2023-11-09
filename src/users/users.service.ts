import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { SignupInput } from "src/auth/dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { hash } from "bcrypt";

@Injectable()
export class UsersService {
  private readonly logger = new Logger("ItemsService");

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async create({ password, ...rest }: SignupInput): Promise<User> {
    try {
      // encrypt password
      const encryptedPassword = await hash(password, 10);
      const newUser = this.userRepository.create({ password: encryptedPassword, ...rest });

      return await this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error(error);
      this.handleDbExceptions(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOne(id: string): Promise<User> {
    throw new Error("findOne not implemented");
  }

  block(id: string): Promise<User> {
    throw new Error("block not implemented");
  }

  private handleDbExceptions(error: any) {
    if (error.code === "23505") {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException("Unexpected error, check server logs");
  }
}
