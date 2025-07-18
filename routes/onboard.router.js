import { Router } from "express";
import authorize from "../middlewares/auth.middleware";
import { deleteEmployee, getEmployee, getEmployees, onboardEmployee, updateEmployee } from "../controllers/onboard.controller";

const onboardRouter = Router();

onboardRouter.post("/",authorize,onboardEmployee);
onboardRouter.get("/",authorize,getEmployees); 
onboardRouter.put("/:id",authorize,updateEmployee);
onboardRouter.get("/:id",authorize,getEmployee);
onboardRouter.delete("/:id",authorize,deleteEmployee);
onboardRouter.get("/search", (req, res) => {
  // Logic to search employee details
  res.send("Employee search results");
});
onboardRouter.get("/report", (req, res) => {
  // Logic to generate employee report
  res.send("Employee report generated");
});