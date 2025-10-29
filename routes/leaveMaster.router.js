import express from 'express';
import { getLeaveMaster, createOrUpdateLeaveMaster, deleteLeaveMaster } from '../controllers/leaveMaster.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const leaveMasterRouter = express.Router();

leaveMasterRouter.post('/', authorize, createOrUpdateLeaveMaster);
leaveMasterRouter.get('/', authorize, getLeaveMaster);
leaveMasterRouter.delete('/:id', authorize, deleteLeaveMaster);

export default leaveMasterRouter;