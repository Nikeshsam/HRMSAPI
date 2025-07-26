import {Router} from 'express';
import {insertOrganizationDetails,getOrganizationDetails,updateOrganizationDetails} from '../controllers/organization.controller.js';
import authorize from '../middlewares/auth.middleware.js'
import { createUploadMiddleware } from '../middlewares/uploadFile.middleware.js';
const organizationRouter = Router();

organizationRouter.post('/',authorize,createUploadMiddleware({
    fieldName:'companyLogo',
    fileSize: 5,
}),insertOrganizationDetails);
organizationRouter.get('/',authorize,getOrganizationDetails);
organizationRouter.patch('/:id',authorize,createUploadMiddleware({
    fieldName:'companyLogo',
    fileSize: 5,
}),updateOrganizationDetails);

export default organizationRouter;