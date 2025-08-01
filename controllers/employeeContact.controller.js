import mongoose from "mongoose";
import Employees from "../model/Employees.model";
import EmployeeContactDetails from "../model/EmployeeContact.model";





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
