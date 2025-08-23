import type { AstroSharedContext } from "astro";
import { messages } from "../../shared/messages";
import { createUserService } from "../services/registerUser";
import { HttpError } from "../../error/httpError";
export class UserController {
  constructor(private readonly service: createUserService) {}

  async getAllUsers({ request: req }: AstroSharedContext) {
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

      const userResponse = await this.service.execute(userData);
      return Response.json(userResponse);
    
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
}
