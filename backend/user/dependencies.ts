import { UserRepository } from "./repositories/userRepository";
// services
import { CreateUserService } from "./services/registerUser";
import { VerifyUserService } from "./services/verifyUserService";

// controllers
import { UserController } from "./controllers/userController";

const userRepository = new UserRepository();
const createUserService = new CreateUserService(userRepository);
const verifyUserService = new VerifyUserService(userRepository);

export const userController = new UserController(
  createUserService,
  verifyUserService,
);
