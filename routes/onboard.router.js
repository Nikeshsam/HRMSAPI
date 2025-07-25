import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { deleteEmployee, getEmployee, getEmployees, onboardEmployee, updateEmployee, searchEmployees, exportEmployeesExcel } from "../controllers/onboard.controller.js";
import { createUploadMiddleware } from "../middlewares/uploadFile.middleware.js";

const onboardRouter = Router();

onboardRouter.post("/",authorize,createUploadMiddleware({
    fieldName: "offerletter",
    fileSize: 10,
}),onboardEmployee);
onboardRouter.get("/",authorize,getEmployees); 

onboardRouter.get("/search",searchEmployees);
onboardRouter.get("/report", exportEmployeesExcel);

onboardRouter.put("/:id",authorize,updateEmployee);
onboardRouter.get("/:id",authorize,getEmployee);
onboardRouter.delete("/:id",authorize,deleteEmployee);


export default onboardRouter;