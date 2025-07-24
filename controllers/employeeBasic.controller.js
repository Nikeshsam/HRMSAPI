import EmployeeBasicDetails from "../model/EmployeeBasicDetails.model.js";
import Employees from "../model/Employees.model.js";
import mongoose from "mongoose";


export const createEmployeeBasicDetails = async (req, res) => {
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
    if(!user){
        await session.abortTransaction();
        await session.endSession();
        return res.status(401).json({message: 'Unauthorized access'});
    }
    try{
        const employee = await Employees.findOne({userId:user});
        if (!employee) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(404).json({message: 'Employee not found'});
        }

        const newEmployeeBasicDetails = new EmployeeBasicDetails({
            employee,
            firstName,
            lastName,
            dateOfBirth,
            age,
            nationality,
            gender,
            maritualStatus,
            dateOfMarriage
        });
        await newEmployeeBasicDetails.validate();
        await newEmployeeBasicDetails.save({session});
        await session.commitTransaction();  
        await session.endSession();
        return res.status(201).json({message: 'Employee basic details created successfully'});
    }catch(error){
        await session.abortTransaction();
        await session.endSession();
        return res.status(500).json({message: 'Internal server error', error: error.message});
    }

}

export const getEmployeeBasicDetails = async (req, res) => {
    const user = req.user;
    const {id} = req.params;
    if(!user){
        return res.status(401).json({message: 'Unauthorized access'});
    }
    try{
        console.log(req.params);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: 'Invalid employee ID'});
        }
        const employee = await Employees.findById(id);
        if (!employee) {
            return res.status(404).json({message: 'Employee not found'});
        }
        const employeeBasicDetails = await EmployeeBasicDetails.findOne({employee}).populate('employee');
        if (!employeeBasicDetails) {
            return res.status(404).json({message: 'Employee basic details not found'});
        }
        return res.status(200).json({message: 'Employee basic details retrieved successfully', employeeBasicDetails});
    }catch(error){
        return res.status(500).json({message: 'Internal server error', error: error.message});
    }

}