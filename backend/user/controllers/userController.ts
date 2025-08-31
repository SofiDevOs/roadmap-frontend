import type { AstroSharedContext } from "astro";
import { Resend } from "resend";
import { messages } from "../../shared/messages";
import { CreateUserService } from "../services/registerUser";
import { HttpError } from "../../error/httpError";
import { RESEND_API_KEY } from "../../../src/config";
import { VerifyUserService } from "../services/verifyUserService";

export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly verifyUserService: VerifyUserService,
  ) {}


  async register({ request: req }: AstroSharedContext ) {
    const formData = await req.formData();

    const [username, fullname, email, password] = [
      formData.get("username")?.toString().trim() ?? null, // 0
      formData.get("fullname")?.toString().trim() ?? null, // 1
      formData.get("email")?.toString().trim() ?? null, //2
      formData.get("password")?.toString().trim() ?? null, //3
    ];

    if (!email || !username || !password || !fullname)
      return Response.json(
        {message: messages.REQUIRED_FIELDS_MISSING},
        { status: 400 },
      )
    try {
      const userData = {
        username,
        fullname,
        email,
        password,
      };

      const {token, ...rest}  = await this.createUserService.execute(userData);
      await this.verifyUserService.sendVerificationEmail(email, token)

      return Response.json(rest);

    } catch (error) {

      if (error instanceof HttpError)
        return Response.json(
          { message:error.message},
          { status: error.statusCode }
        )

      return Response.json(
        { message: messages.INTERNAL_ERROR },
        { status: 500 },
      );
    }
  }

  async verify({ url, redirect }: AstroSharedContext) {

    const token = url.searchParams.get("token");

    if (!token) return redirect("/access?error=token_missing");

    try {

      await this.verifyUserService.verify(token)
      return redirect("/access?message=account_verified");

    } catch (error) {

      if (error instanceof HttpError) {
        const errorMessage = error.message.toLowerCase().replace(/ /g, "_");
        return redirect(`/access?error=${errorMessage}`);

      }

      return redirect("/access?error=internal_error");
    }

  }

  async getUserById({ url }: AstroSharedContext) {

    const userId = url.searchParams.get("test"); // working progress
    return Response.json({message: "ok", userId})

  }
}
