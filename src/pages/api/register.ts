import type { APIRoute } from "astro";
import { UserRepository } from "@backend/user/repositories/userRepository";
import { UserController } from "@backend/user/controllers/userController";
import { createUserService } from "@backend/user/services/registerUser";
const userRepository = new createUserService(new UserRepository());
const userController = new UserController(userRepository);

export const POST: APIRoute = userController.register.bind(userController);
