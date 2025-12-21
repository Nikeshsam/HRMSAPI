import { Router } from "express";

import {applyLeave,cancelLeave,getLeaveApplications,getLeaveBalance} from "../controllers/leaveApplication.controller.js";
const applyLeaveRouter = Router();

applyLeaveRouter.post("/", applyLeave);
applyLeaveRouter.post("/cancel/:id", cancelLeave);
applyLeaveRouter.get("/", getLeaveApplications);
applyLeaveRouter.get("/balance", getLeaveBalance);
// Placeholder for leave controller functions

export default applyLeaveRouter;