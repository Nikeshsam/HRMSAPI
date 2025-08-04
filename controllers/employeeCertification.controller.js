import mongoose from "mongoose";
import Employees from "../model/Employees.model.js";
import EmployeeCertification from "../model/EmployeeCertification.model.js";

export const createOrUpdateEmployeeCertificationDetails = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const {
        name,
        issuedBy,
        issuedDate,
        expiryDate,
        additionalInfo
    } = req.body;

    const user = req.user;
    if (!user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        const employee = await Employees.findOne({ userId: user });
        if (!employee) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Employee not found' });
        }
        console.log(employee);
        let employeeCertification = await EmployeeCertification.findOne({ employee: employee._id });

        if (employeeCertification) {
            // UPDATE
            employeeCertification.set({
                name,
                issuedBy,
                issuedDate,
                expiryDate,
                additionalInfo
            });

            await employeeCertification.validate();
            await employeeCertification.save({ session });
        } else {
            // CREATE
            employeeCertification = new EmployeeCertification({
                employee: employee._id,
                name,
                issuedBy,
                issuedDate,
                expiryDate,
                additionalInfo
            });

            await employeeCertification.validate();
            await employeeCertification.save({ session });
            employeeCertification.wasNew=true;
        }

        await session.commitTransaction();
        session.endSession();
        
        return res.status(employeeCertification.wasNew?201:200).json({
            message: employeeCertification.wasNew
                ? 'Employee Experience details created successfully'
                : 'Employee Experience details updated successfully',
            data: employeeCertification
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getEmployeeCertification = async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        
        // Fetch employee by ID
        const employee = await Employees.findOne({userId:user});
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Fetch employee's certification details
        const employeeCertification = await EmployeeCertification.findOne({ employee: employee._id }).populate('employee');

        if (!employeeCertification) {
            return res.status(404).json({ message: 'Employee certification details not found' });
        }

        return res.status(200).json({
            message: 'Employee certification details retrieved successfully',
            data: employeeCertification
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
