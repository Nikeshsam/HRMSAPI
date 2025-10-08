import mongoose from "mongoose";
import Holiday from "../model/Holiday.model.js";


export const createorUpdateHoliday = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { holidayname, holidaydate, description, _id } = req.body;
        if (!holidayname || !holidaydate) {
            session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Holiday name and date are required" });
        }
        const user = req.user;
        const holiday = await Holiday.findById(_id);
        if (holiday) {
            // Update existing holiday
            holiday.holidayname = holidayname;
            holiday.holidaydate = holidaydate;
            holiday.description = description;
            await holiday.save();
            await session.commitTransaction();
            await session.endSession();
            return res.status(200).json({ message: "Holiday updated successfully", holiday });
        }
        const existingHoliday = await Holiday.findOne({ holidaydate, company: user.company });
        if (existingHoliday && (!_id || existingHoliday._id.toString() !== _id)) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(400).json({ message: "Holiday already exists on the date" });
        }

            // Create new holiday
            const newHoliday = new Holiday({ holidayname, holidaydate, description, company: user.company });
            await newHoliday.save();
            await session.commitTransaction();
            await session.endSession();
            return res.status(201).json({ message: "Holiday created successfully", holiday: newHoliday });
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        console.error("Error creating/updating holiday:", error);
        return res.status(500).json({ message: "Internal server error" ,error:error});
    }
};

export const getHolidays = async (req, res) => {
    try {
        const user = req.user;
        const { search } = req.query || '';
        let query = { company: user.company };
        let holidays = await Holiday.find({ company: user.company });

        if (search) {
            query.holidayname = { $regex: search, $options: 'i' };
            holidays = await Holiday.find(query);
        }
        return res.status(200).json({ holidays });
    } catch (error) {
        console.error("Error fetching holidays:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteHoliday = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const holiday = await Holiday.findOneAndDelete({ _id: id, company: user.company });
        if (!holiday) {
            return res.status(404).json({ message: "Holiday not found" });
        }
        return res.status(200).json({ message: "Holiday deleted successfully" });
    } catch (error) {
        console.error("Error deleting holiday:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
