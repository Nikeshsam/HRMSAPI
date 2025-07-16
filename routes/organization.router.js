import {Router} from 'express';
import {insertOrganizationDetails} from '../controllers/organization.controller.js';
import { validateUser } from '../controllers/auth.controller.js';
const organizationRouter = Router();

organizationRouter.post('/',validateUser,insertOrganizationDetails);


export default organizationRouter;