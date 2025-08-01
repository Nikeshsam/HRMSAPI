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
        maritualStatus,
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
                maritualStatus,
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
                maritualStatus,
                dateOfMarriage
            });

            await employeeBasicDetails.validate();
            await employeeBasicDetails.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
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
    const { id } = req.params;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }

        // Fetch employee by ID
        const employee = await Employees.findById(id);
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


export const createOrUpdateEmployeeContactDetails = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const user = req.user;
    const {
        primaryMobileNo,
        secondaryMobileNo,
        email,
        currentAddress,
        permanentAddress,
        relationName,
        relationship,
        relationContactNo,
        relationEmail,
        relationAddress
    } = req.body;

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

        let contactDetails = await EmployeeContactDetails.findOne({ employee: employee._id });

        if (contactDetails) {
            // Update
            contactDetails.set({
                primaryMobileNo,
                secondaryMobileNo,
                email,
                currentAddress,
                permanentAddress,
                relationName,
                relationship,
                relationContactNo,
                relationEmail,
                relationAddress
            });

            await contactDetails.validate();
            await contactDetails.save({ session });
        } else {
            // Create
            contactDetails = new EmployeeContactDetails({
                employee: employee._id,
                primaryMobileNo,
                secondaryMobileNo,
                email,
                currentAddress,
                permanentAddress,
                relationName,
                relationship,
                relationContactNo,
                relationEmail,
                relationAddress
            });

            await contactDetails.validate();
            await contactDetails.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: contactDetails.wasNew
                ? 'Employee contact details created successfully'
                : 'Employee contact details updated successfully',
            data: contactDetails
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getEmployeeContactDetails = async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }

        const employee = await Employees.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const contactDetails = await EmployeeContactDetails.findOne({ employee: employee._id }).populate('employee');
        if (!contactDetails) {
            return res.status(404).json({ message: 'Employee contact details not found' });
        }

        return res.status(200).json({
            message: 'Employee contact details retrieved successfully',
            data: contactDetails
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
