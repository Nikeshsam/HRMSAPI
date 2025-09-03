import mongoose from "mongoose";
import Employees from "../model/Employees.model.js";
import EmployeeCertification from "../model/EmployeeCertification.model.js";

export const createOrUpdateEmployeeCertificationDetails = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
   
    const employeeCertifications = req.body.employeeCertifications || [];
    const user = req.user;

    if (!user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    if (!Array.isArray(employeeCertifications) || employeeCertifications.length === 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'No certification details provided' });  
    }

    try {
        const employee = await Employees.findOne({ userId: user });
        
        if (!employee) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        let results = [];

        for (const cert of employeeCertifications){
            const {
                _id,
                name,
                issuedBy,
                issuedDate,
                additionalInfo
            } = cert;

            let employeeCertification;

            if (_id && mongoose.isValidObjectId(_id)) {
                employeeCertification = await EmployeeCertification.findOne({ _id, employee: employee._id });
            }
            if(employeeCertification){
                employeeCertification.set({
                    name,
                    issuedBy,
                    issuedDate,
                    additionalInfo
                });

                await employeeCertification.validate();
                await employeeCertification.save({ session });
                results.push({ type: 'updated', _id: employeeCertification._id });
                continue;
            }

            // Else → Create flow with duplicate check
            const duplicate = await EmployeeCertification.findOne({
                employee: employee._id,
                name,
                issuedBy,
                issuedDate
            });
            if (duplicate) {
                await session.abortTransaction();
                session.endSession();
                return res.status(409).json({ message: `Duplicate certification found for ${name}` });
            }
            // CREATE
            employeeCertification = new EmployeeCertification({
                employee: employee._id,
                name,
                issuedBy,
                issuedDate,
                additionalInfo
            });

            await employeeCertification.validate();
            await employeeCertification.save({ session });
            results.push({ type: 'created', _id: employeeCertification._id });
        }

        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            message: 'Employee certification details processed successfully',
            results
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
        const employeeCertification = await EmployeeCertification.findOne({ employee: employee._id });

        if (!employeeCertification) {
            return res.status(404).json({ message: 'Employee certification details not found' });
        }

        return res.status(200).json({
            message: 'Employee certification details retrieved successfully',
            employeeCertifications: employeeCertification
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


export const deleteEmployeeCertification = async(req, res) => {
    const user = req.user;
    const { id } = req.params;

    if(!user){
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        if(!id || !mongoose.isValidObjectId(id)){
            return res.status(400).json({ message: 'Invalid certification ID' });
        }

        const employeeCertification = await EmployeeCertification.findOneAndDelete({ _id: id});
        if (!employeeCertification) {
        return res.status(404).json({ message: 'Employee certification not found or does not belong to this employee' });
        }

        return res.status(200).json({message:'Employee Certification deleted successfully'});

    }catch(error){
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
    
};