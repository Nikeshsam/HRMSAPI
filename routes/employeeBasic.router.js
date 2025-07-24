import {Router} from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createEmployeeBasicDetails, getEmployeeBasicDetails } from '../controllers/employeeBasic.controller.js';
const employeeBasicRouter = Router();


employeeBasicRouter.post('/',authorize,createEmployeeBasicDetails);
employeeBasicRouter.get('/:id',authorize,getEmployeeBasicDetails);

export default employeeBasicRouter;