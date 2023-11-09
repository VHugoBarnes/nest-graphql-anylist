import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { LoginInput, SignupInput } from "./dto";
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

  @Mutation(() => AuthResponse, { name: "login" })
  login(
    @Args("loginInput") loginInput: LoginInput
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  // @Query(, { name: "revalidate" })
  // revalidateToken() {
  //   return this.authService.revalidateToken();
  // }
}
