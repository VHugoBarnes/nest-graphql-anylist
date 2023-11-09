import { Injectable } from "@nestjs/common";
import { AuthResponse } from "./types/auth-response.type";
import { SignupInput } from "./dto";

@Injectable()
export class AuthService {
  constructor(

  ) { }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    console.log({ signupInput });
    throw new Error("signup service not implemented");
  }
}
