import express from 'express';
import { getLeaveMaster, createOrUpdateLeaveMaster, deleteLeaveMaster, getLeaveMasterCombo } from '../controllers/leaveMaster.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const leaveMasterRouter = express.Router();

leaveMasterRouter.post('/', authorize, createOrUpdateLeaveMaster);
leaveMasterRouter.get('/', authorize, getLeaveMaster);
leaveMasterRouter.delete('/:id', authorize, deleteLeaveMaster);
leaveMasterRouter.get('/combo', authorize, getLeaveMasterCombo);

export default leaveMasterRouter;