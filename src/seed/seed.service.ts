import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.isProd = configService.get("state") === "prod";
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) throw new UnauthorizedException("[cant-run-seed]");

    // Clean database

    // Load users

    // Load items
    return true;
  }
}
