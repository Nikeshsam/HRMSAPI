import mongoose from "mongoose";
import Employees from '../model/Employees.model.js';
import EmployeeDependentDetails from '../model/EmployeeDependentDetails.model.js';
import EmployeeBasicDetails from "../model/EmployeeBasicDetails.model.js";
import EmployeeBenefits from "../model/EmployeeBenefits.model.js";
import EmployeeCertification from "../model/EmployeeCertification.model.js";
import EmployeeContactDetails from "../model/EmployeeContact.model.js";
import EmployeeEducationDetails from '../model/EmployeeEducationDetails.model.js';
import EmployeeExperience from "../model/EmployeeExperience.model.js";
import EmployeeHealthRecord from "../model/EmployeeHelthRecord.model.js";
import EmployeeTravelDetails from "../model/EmployeeTravelDetails.model.js";

export const getEmployeeDetails = async (req, res) => {
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
        const employeeBasicDetails = await EmployeeBasicDetails.findOne({ employee: employee._id });
        const employeeBenefits = await EmployeeBenefits.find({ employee: employee._id });
        const employeeCertifications = await EmployeeCertification.find({ employee: employee._id });
        const employeeContactDetails = await EmployeeContactDetails.findOne({ employee: employee._id });
        const employeeEducationDetails = await EmployeeEducationDetails.find({ employee: employee._id });
        const employeeExperience = await EmployeeExperience.find({ employee: employee._id });
        const employeeHealthRecord = await EmployeeHealthRecord.findOne({ employee: employee._id });
        const employeeTravelDetails = await EmployeeTravelDetails.find({ employee: employee._id });
        const employeeDependentDetails = await EmployeeDependentDetails.find({ employee: employee._id });


        if (!employeeBasicDetails) {
            return res.status(404).json({ message: 'Employee basic details not found' });
        }

        return res.status(200).json({
            message: 'Employee basic details retrieved successfully',
            employee,
            employeeBasicDetails,
            employeeBenefits,
            employeeCertifications,
            employeeContactDetails,
            employeeEducationDetails,
            employeeExperience,
            employeeHealthRecord,
            employeeTravelDetails,
            employeeDependentDetails
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

export const getEmployeeDetailsBasedOnId = async (req, res) => {
    const user = req.user;
    const { id } = req.params;  
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        
        // Fetch employee by ID
        const employee = await Employees.findOne({_id:id});
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Fetch employee's basic details
        const employeeBasicDetails = await EmployeeBasicDetails.findOne({ employee: employee._id });
        const employeeBenefits = await EmployeeBenefits.find({ employee: employee._id });
        const employeeCertifications = await EmployeeCertification.find({ employee: employee._id });
        const employeeContactDetails = await EmployeeContactDetails.findOne({ employee: employee._id });
        const employeeEducationDetails = await EmployeeEducationDetails.find({ employee: employee._id });
        const employeeExperience = await EmployeeExperience.find({ employee: employee._id });
        const employeeHealthRecord = await EmployeeHealthRecord.findOne({ employee: employee._id });
        const employeeTravelDetails = await EmployeeTravelDetails.find({ employee: employee._id });
        const employeeDependentDetails = await EmployeeDependentDetails.find({ employee: employee._id });


        if (!employeeBasicDetails) {
            return res.status(404).json({ message: 'Employee basic details not found' });
        }

        return res.status(200).json({
            message: 'Employee basic details retrieved successfully',
            employee,
            employeeBasicDetails,
            employeeBenefits,
            employeeCertifications,
            employeeContactDetails,
            employeeEducationDetails,
            employeeExperience,
            employeeHealthRecord,
            employeeTravelDetails,
            employeeDependentDetails
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}