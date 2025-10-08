import { Router } from "express";
import { createorUpdateHoliday, deleteHoliday, getHolidays } from "../controllers/holiday.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const holidayRouter = Router();

holidayRouter.post('/', authorize, createorUpdateHoliday);
holidayRouter.get('/', authorize, getHolidays);
holidayRouter.delete('/:id', authorize, deleteHoliday);

export default holidayRouter;