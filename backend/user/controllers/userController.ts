import type { AstroSharedContext } from "astro";
import { User } from "../models/UserModel";

import { messages } from "../../shared/messages";
import { isValidEmail } from "../../shared/emailValidator";
import { createUserService } from "../services/registerUser";

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
      return new Response(
        JSON.stringify({
          message: messages.REQUIRED_FIELDS_MISSING,
        }),
        { status: 400 },
      );

    if (!isValidEmail(email))
      return new Response(
        JSON.stringify({
          message: messages.INVALID_INPUT,
        }),
        { status: 400 },
      );

    const user = new User(username, fullname, email, password);
    try {
      const userResponse = await this.service.execute(user);

      return new Response(JSON.stringify(userResponse), {
        status: 201,
        headers: {
          "content-type": "application/json",
        },
      });
    } catch (error) {
      return new Response("", { status: 500 });
    }
  }
}
