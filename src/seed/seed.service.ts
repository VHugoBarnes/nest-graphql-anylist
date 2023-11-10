import { Injectable } from "@nestjs/common";

@Injectable()
export class SeedService {
  constructor() { }

  async executeSeed(): Promise<boolean> {
    // Clean database

    // Load users

    // Load items
    return true;
  }
}
