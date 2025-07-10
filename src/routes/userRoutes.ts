import express from "express";
import { UserController } from "../controllers/UserController";
import { uploadFields } from "../middleware/multerConfig";

const router = express.Router();
const userController = new UserController();

router.post("/users/register", userController.register.bind(userController));
router.post("/users/complete-registration", uploadFields, userController.completeRegistration.bind(userController));

export default router;