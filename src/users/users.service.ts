import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { SignupInput } from "src/auth/dto";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundError, Repository } from "typeorm";
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

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email: email });
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  block(id: string): Promise<User> {
    throw new Error("block not implemented");
  }

  private handleDbExceptions(error: any) {
    if (error.code === "23505") {
      throw new BadRequestException("[user-exists]");
    }

    if (error instanceof EntityNotFoundError) {
      throw new NotFoundException("[user-not-found]");
    }

    this.logger.error(error);
    throw new InternalServerErrorException("Unexpected error, check server logs");
  }
}
