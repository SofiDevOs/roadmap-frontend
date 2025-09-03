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


  /**
   * Registers a new user with the provided form data.
   *
   * This method expects a request containing the following fields in the form data:
   * - `username`: The desired username for the new user.
   * - `fullname`: The full name of the user.
   * - `email`: The user's email address.
   * - `password`: The user's password.
   *
   * If any required field is missing, it returns a 400 error response.
   * On success, it creates the user, sends a verification email, and returns the user data.
   * Handles known errors with appropriate status codes and messages.
   *
   * @param context - The AstroSharedContext containing the request object.
   * @returns A JSON response with the user data or an error message.
   *
   * @example
   * ```typescript
   * // Example usage in an Astro endpoint
   * const response = await userController.register({ request });
   * ```
   *
   * @example
   * // Example form data submission
   * const formData = new FormData();
   * formData.append("username", "johndoe");
   * formData.append("fullname", "John Doe");
   * formData.append("email", "john@example.com");
   * formData.append("password", "securePassword123");
   * const response = await fetch("/api/register", {
   *   method: "POST",
   *   body: formData,
   * });
   * ```
   */
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


  /**
   * Verifies a user's account using a token from the URL query parameters.
   *
   * Redirects the user to the appropriate access page based on the verification result:
   * - If the token is missing, redirects with an error message.
   * - If verification succeeds, redirects with a success message.
   * - If verification fails due to an HTTP error, redirects with a specific error message.
   * - For any other errors, redirects with a generic internal error message.
   *
   * @param context - The shared Astro context containing the URL and redirect function.
   * @returns A redirect to the access page with an appropriate message.
   *
   * @example
   * ```typescript
   * // Example usage in an Astro route handler
   * export async function get(context: AstroSharedContext) {
   *   return await userController.verify(context);
   * }
   * ```
   */
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

  /**
   * Retrieves a user by their ID from the query parameters of the request URL.
   *
   * @param context - The Astro shared context containing the request URL.
   * @returns A JSON response containing a message and the extracted user ID.
   *
   * @example
   * // Example usage within an Astro endpoint:
   * export const get = async (context) => {
   *   return await getUserById(context);
   * };
   *
   * // If the request URL is: /api/user?test=123
   * // The response will be:
   * // {
   * //   "message": "ok",
   * //   "userId": "123"
   * // }
   */
  async getUserById({ url }: AstroSharedContext) {

    const userId = url.searchParams.get("test"); // working progress
    return Response.json({message: "ok", userId})

  }
}
