import {Router} from 'express';
import {insertOrganizationDetails,getOrganizationDetails} from '../controllers/organization.controller.js';
import { validateUser } from '../controllers/auth.controller.js';
const organizationRouter = Router();

organizationRouter.post('/',validateUser,insertOrganizationDetails);
organizationRouter.get('/',validateUser,getOrganizationDetails);

export default organizationRouter;