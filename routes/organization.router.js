import {Router} from 'express';
import {insertOrganizationDetails,getOrganizationDetails} from '../controllers/organization.controller.js';
import authorize from '../middlewares/auth.middleware.js'
const organizationRouter = Router();

organizationRouter.post('/',authorize,insertOrganizationDetails);
organizationRouter.get('/',authorize,getOrganizationDetails);

export default organizationRouter;