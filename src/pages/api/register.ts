import type { APIRoute, AstroSharedContext } from "astro";
import { userController } from "@backend/user/dependencies";

export const GET: APIRoute = (context: AstroSharedContext) => userController.getUserById(context);
export const POST: APIRoute = (context: AstroSharedContext) =>  userController.register(context);
