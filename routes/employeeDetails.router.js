import {Router} from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createOrUpdateEmployeeBasicDetails, getEmployeeBasicDetails } from '../controllers/employeeBasic.controller.js';
import { createOrUpdateEmployeeContactDetails, getEmployeeContactDetails } from '../controllers/employeeBasic.controller.js';
import { createOrUpdateDependentDetails, getDependentDetails } from '../controllers/employeeDependent.controller.js';
import { createOrUpdateEducationDetails, getEducationDetails } from '../controllers/employeeEducation.controller.js';
const employeeDetailsRouter = Router();


employeeDetailsRouter.post('/basic-details',authorize,createOrUpdateEmployeeBasicDetails);
employeeDetailsRouter.post('/contact-details',authorize,createOrUpdateEmployeeContactDetails);
employeeDetailsRouter.post('/dependents',authorize,createOrUpdateDependentDetails);
employeeDetailsRouter.post('/education-details',authorize,createOrUpdateEducationDetails);




employeeDetailsRouter.get('/basic-details',authorize,getEmployeeBasicDetails);
employeeDetailsRouter.get('/contact-details',authorize,getEmployeeContactDetails);
employeeDetailsRouter.get('/dependents',authorize,getDependentDetails);
employeeDetailsRouter.get('/education-details',authorize,getEducationDetails);



employeeDetailsRouter.get('/basic',authorize,getEmployeeBasicDetails);

export default employeeDetailsRouter;