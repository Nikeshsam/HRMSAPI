import {Router} from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createOrUpdateEmployeeBasicDetails, getEmployeeBasicDetails } from '../controllers/employeeBasic.controller.js';
import { createOrUpdateEmployeeContactDetails, getEmployeeContactDetails } from '../controllers/employeeContact.controller.js';
import { createOrUpdateDependentDetails, deleteDependent, getDependentDetails } from '../controllers/employeeDependent.controller.js';
import { createOrUpdateEducationDetails, deleteEmployeeEducation, getEducationDetails } from '../controllers/employeeEducation.controller.js';
import { createOrUpdateEmployeeCertificationDetails, deleteEmployeeCertification, getEmployeeCertification } from '../controllers/employeeCertification.controller.js';
import { createOrUpdateEmployeeExperienceDetails, getEmployeeExperienceDetails, deleteEmployeeExperience } from '../controllers/employeeExperience.controller.js';
import { createOrUpdateEmployeeBenefits, deleteEmployeeBenefit, getEmployeeBenefits } from '../controllers/employeeBenefits.controller.js';
const employeeDetailsRouter = Router();


employeeDetailsRouter.post('/basic-details',authorize,createOrUpdateEmployeeBasicDetails);
employeeDetailsRouter.post('/contact-details',authorize,createOrUpdateEmployeeContactDetails);
employeeDetailsRouter.post('/dependents',authorize,createOrUpdateDependentDetails);
employeeDetailsRouter.post('/education-details',authorize,createOrUpdateEducationDetails);
employeeDetailsRouter.post('/certification', authorize, createOrUpdateEmployeeCertificationDetails);
employeeDetailsRouter.post('/experience', authorize, createOrUpdateEmployeeExperienceDetails);
employeeDetailsRouter.post('/benefits', authorize, createOrUpdateEmployeeBenefits);


employeeDetailsRouter.get('/basic-details',authorize,getEmployeeBasicDetails);
employeeDetailsRouter.get('/contact-details',authorize,getEmployeeContactDetails);
employeeDetailsRouter.get('/dependents',authorize,getDependentDetails);
employeeDetailsRouter.get('/education-details',authorize,getEducationDetails);
employeeDetailsRouter.get('/certification', authorize, getEmployeeCertification);
employeeDetailsRouter.get('/experience', authorize, getEmployeeExperienceDetails);
employeeDetailsRouter.get('/benefits', authorize, getEmployeeBenefits);



employeeDetailsRouter.get('/basic',authorize,getEmployeeBasicDetails);

employeeDetailsRouter.delete('/dependents/:id',authorize,deleteDependent);
employeeDetailsRouter.delete('/education-details/:id',authorize,deleteEmployeeEducation);
employeeDetailsRouter.delete('/certification/:id', authorize, deleteEmployeeCertification);
employeeDetailsRouter.delete('/experience/:id', authorize, deleteEmployeeExperience);
employeeDetailsRouter.delete('/benefits/:id', authorize, deleteEmployeeBenefit);

export default employeeDetailsRouter;