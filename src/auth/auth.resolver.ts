import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { SignupInput } from "./dto";
import { AuthResponse } from "./types/auth-response.type";

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => AuthResponse, { name: "signup" })
  signup(
    @Args("signupInput") signupInput: SignupInput
  ): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }

  // @Mutation(() => , { name: "login" })
  // login(): Promise<> {
  //   return this.authService.login();
  // }

  // @Query(, { name: "revalidate" })
  // revalidateToken() {
  //   return this.authService.revalidateToken();
  // }
}
