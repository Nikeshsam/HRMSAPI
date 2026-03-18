import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { deleteEmployee, getEmployee, getEmployees, onboardEmployee, updateEmployee, exportEmployeesExcel, getEmployeeId, getManagersByDepartment } from "../controllers/onboard.controller.js";
import { createUploadMiddleware } from "../middlewares/uploadFile.middleware.js";
import { getEmployeeDetailsBasedOnId } from "../controllers/employeeDetails.controller.js";

const onboardRouter = Router();

onboardRouter.post("/",authorize,createUploadMiddleware({
    fieldName: "offerletter",
    fileSize: 10,
}),onboardEmployee);
onboardRouter.get("/",authorize,getEmployees); 

onboardRouter.get("/export",authorize, exportEmployeesExcel);
onboardRouter.get('/empId',authorize,getEmployeeId);

onboardRouter.get('/:id',authorize,getEmployeeDetailsBasedOnId);
onboardRouter.put("/:id",authorize,createUploadMiddleware({
    fieldName: "offerletter",
    fileSize: 10,
}),updateEmployee);
onboardRouter.get("/:id",authorize,getEmployee);
onboardRouter.delete("/:id",authorize,deleteEmployee);
onboardRouter.get("/managers/:departmentId/:designation",authorize,getManagersByDepartment);

export default onboardRouter;