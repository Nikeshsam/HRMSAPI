import { Router } from "express";

import { registerCompany,signIn,validateUser } from "../controllers/auth.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const authRouter = Router();


authRouter.post("/register",registerCompany)
authRouter.post("/login",signIn)
authRouter.get("/validate",authorize,validateUser)


export default authRouter;