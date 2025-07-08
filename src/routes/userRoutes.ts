import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { upload } from "../middleware/fileUpload";

const router = Router();
const userController = new UserController();

router.post("/register", userController.register.bind(userController));
router.post(
  "/complete-registration",
  upload.fields([
    { name: "companyLogo", maxCount: 1 },
    { name: "digitalSignature", maxCount: 1 },
    { name: "stamp", maxCount: 1 },
  ]),
  userController.completeRegistration.bind(userController)
);

export default router;