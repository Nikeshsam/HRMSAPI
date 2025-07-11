import { Router } from "express";

import { registerCompany,signIn } from "../controllers/auth.controller.js";

const authRouter = Router();


authRouter.post("/register",registerCompany)
authRouter.post("/login",signIn)



export default authRouter;