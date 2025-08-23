import type { APIRoute, AstroSharedContext } from "astro";
import { UserRepository } from "@backend/user/repositories/userRepository";
import { UserController } from "@backend/user/controllers/userController";
import { createUserService } from "@backend/user/services/registerUser";
const userRepository = new createUserService(new UserRepository());
const userController = new UserController(userRepository);
const env = import.meta.env;

export const GET: APIRoute = (context: AstroSharedContext) => userController.getUserById(context);
export const POST: APIRoute = (context: AstroSharedContext) =>  userController.register(context, env);
