import EmployeeBasicDetails from "../model/EmployeeBasicDetails.model.js";
import Employees from "../model/Employees.model.js";
import mongoose from "mongoose";
import EmployeeContactDetails from "../model/EmployeeContact.model.js";

export const createOrUpdateEmployeeBasicDetails = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const {
        firstName,
        lastName,
        dateOfBirth,
        age,
        nationality,
        gender,
        maritalStatus,
        dateOfMarriage
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
        let employeeBasicDetails = await EmployeeBasicDetails.findOne({ employee: employee._id });

        if (employeeBasicDetails) {
            // UPDATE
            employeeBasicDetails.set({
                firstName,
                lastName,
                dateOfBirth,
                age,
                nationality,
                gender,
                maritalStatus,
                dateOfMarriage
            });

            await employeeBasicDetails.validate();
            await employeeBasicDetails.save({ session });
        } else {
            // CREATE
            employeeBasicDetails = new EmployeeBasicDetails({
                employee: employee._id,
                firstName,
                lastName,
                dateOfBirth,
                age,
                nationality,
                gender,
                maritalStatus,
                dateOfMarriage
            });

            await employeeBasicDetails.validate();
            await employeeBasicDetails.save({ session });
            employeeBasicDetails.wasNew=true;
        }

        await session.commitTransaction();
        session.endSession();
        
        console.log(employeeBasicDetails.isNew);
        return res.status(employeeBasicDetails.wasNew?201:200).json({
            message: employeeBasicDetails.wasNew
                ? 'Employee basic details created successfully'
                : 'Employee basic details updated successfully',
            data: employeeBasicDetails
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getEmployeeBasicDetails = async (req, res) => {
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

        // Fetch employee's basic details
        const employeeBasicDetails = await EmployeeBasicDetails.findOne({ employee: employee._id }).populate('employee');

        if (!employeeBasicDetails) {
            return res.status(404).json({ message: 'Employee basic details not found' });
        }

        return res.status(200).json({
            message: 'Employee basic details retrieved successfully',
            data: employeeBasicDetails
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
