import type { AstroSharedContext } from "astro";
import { Resend } from "resend";
import { messages } from "../../shared/messages";
import { createUserService } from "../services/registerUser";
import { HttpError } from "../../error/httpError";
import { RESEND_API_KEY } from "../../../src/config";
export class UserController {
  constructor(private readonly service: createUserService) {}

  async register({ request: req }: AstroSharedContext ) {
    const formData = await req.formData();

    const [username, fullname, email, password] = [
      formData.get("username")?.toString().trim() ?? null, // 0
      formData.get("fullname")?.toString().trim() ?? "", // 1
      formData.get("email")?.toString().trim() ?? null, // 2
      formData.get("password")?.toString().trim() ?? null, // 3
    ];
 
    if (!email || !username || !password)
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

      const {token, ...rest}  = await this.service.execute(userData);
      const resend = new Resend(RESEND_API_KEY);
    
      await resend.emails.send({
        from: 'Roadmap <onboarding@updates.stron.me>', // <--  email de prueba
        to: [rest.email],
        subject: 'Verify your email',
        html: `<a href="http://localhost:4321/api/verify?token=${token}">verify your email</a>`,
      }) 
      return Response.json(rest);
    
    } catch (error) {
      console.error(error);
      console.log(error);

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

  async getUserById({ url }: AstroSharedContext) {
    
    const userId = url.searchParams.get("test"); // working progress
    return Response.json({message: "ok", userId})

  }
}
