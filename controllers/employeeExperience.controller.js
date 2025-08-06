import mongoose from "mongoose";
import Employees from "../model/Employees.model.js";
import EmployeeExperience from "../model/EmployeeExperience.model.js";

export const createOrUpdateEmployeeExperienceDetails = async(req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const user = req.user;
    const experienceDetails = req.body.experienceDetails;

    if(!user){
        await session.abortTransaction();
        await session.endSession();
        return res.status(401).json({message:'Unauthorized Access'});
    }

    if(!Array.isArray(experienceDetails) || experienceDetails.length === 0){
        await session.abortTransaction();
        await session.endSession();
        return res.status(400).json({message:'No experience details provided'});
    }

    try {
        const employee = await Employees.findOne({userId: user._id});

        if(!employee) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(404).json({message:'Employee not found'});
        }

        let results = [];

        for(const exp of experienceDetails) {
            const {
                _id,
                organization,
                location,
                jobTitle,
                startDate,
                endDate
            }= exp;

            let employeeExperience ;
            if(_id && mongoose.isValidObjectId(_id)) {
                employeeExperience = await EmployeeExperience.findOne({_id, employee: employee._id});
            }
            if(employeeExperience) {
                employeeExperience.set({
                    organization,
                    location,
                    jobTitle,
                    startDate,
                    endDate
                });

                await employeeExperience.validate();
                await employeeExperience.save({session});
                results.push({type: 'updated', _id: employeeExperience._id});
                continue;
            } 
            // If no ID is provided, create a new experience record

            const duplicate = await EmployeeExperience.findOne({
                organization,
                location,
                jobTitle,
                startDate,
                endDate,
                employee: employee._id
            });
            // Check for duplicates
            if(duplicate) {
                await session.abortTransaction();
                await session.endSession();
                return res.status(409).json({message: 'Duplicate experience record found'});
            }

            employeeExperience = new EmployeeExperience({
                employee: employee._id,
                organization,
                location,
                jobTitle,
                startDate,
                endDate
            });

            await employeeExperience.validate();
            await employeeExperience.save({session});
            results.push({type: 'created', _id: employeeExperience._id});
        }
        await session.commitTransaction();
        await session.endSession();
        return res.status(200).json({message: 'Experience details saved successfully', results});
    }catch(error){
        await session.abortTransaction();
        await session.endSession();
        return res.status(500).json({message:'Internal Server Error', error: error.message});
    }
}

export const getEmployeeExperienceDetails = async(req, res) => {
    const user = req.user;

    if(!user) {
        return res.status(401).json({message: 'Unauthorized Access'});
    }

    try {
        const employee = await Employees.findOne({userId: user._id});

        if(!employee) {
            return res.status(404).json({message: 'Employee not found'});
        }

        const experienceDetails = await EmployeeExperience.find({employee: employee._id}).sort({startDate: -1});

        return res.status(200).json({
            message: 'Employee experience details fetched successfully',
            experienceDetails
        });
    } catch (error) {
        return res.status(500).json({message: 'Internal server error', error: error.message});
    }
}

export const deleteEmployeeExperience = async(req, res) => {
    const user = req.user;
    const { id } = req.params;

    if(!user) {
        return res.status(401).json({message: 'Unauthorized Access'});
    }

    try {
        const employee = await Employees.findOne({userId: user._id});

        if(!employee) {
            return res.status(404).json({message: 'Employee not found'});
        }

        const experience = await EmployeeExperience.findOneAndDelete({
            _id: id,
            employee: employee._id
        });

        if(!experience) {
            return res.status(404).json({message: 'Experience record not found'});
        }

        return res.status(200).json({message: 'Experience record deleted successfully'});
    } catch (error) {
        return res.status(500).json({message: 'Internal server error', error: error.message});
    }
}