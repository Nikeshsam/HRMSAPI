import Employees from "../model/Employees.model.js";
import EmployeeBenefits from "../model/EmployeeBenefits.model.js";
import mongoose from "mongoose";


export const createOrUpdateEmployeeBenefits = async (req, res) => {
    const session = await EmployeeBenefits.startSession();
    session.startTransaction();
    const user  = req.user;
    const {benefits} = req.body;
    if(!user){
        return res.status(401).json({
            message: "Unauthorized access"
        });
    }

    if(!Array.isArray(benefits) || benefits.length === 0) {
        return res.status(400).json({
            message: "Benefits must be a non-empty array"
        });
    }
        try{
            const employee = await Employees.findOne({ userId: user._id }).session(session);
            if(!employee){
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({
                    message: "Employee not found"
                });
            }
            let results = [];
            for( const benefit of benefits) {
                const {
                    _id,
                    name, 
                    relationship,
                    gender,
                    idNumber,
                    DoB
                } = benefit;
                let existingBenefit;
                if(_id && mongoose.isValidObjectId(_id)) {
                    existingBenefit = await EmployeeBenefits.findById(_id);
                    if(existingBenefit) {
                        existingBenefit.name = name;
                        existingBenefit.relationship = relationship;
                        existingBenefit.gender = gender;
                        existingBenefit.idNumber = idNumber;
                        existingBenefit.DoB = DoB;

                        await existingBenefit.save({ session });
                        results.push({ type: 'updated', _id: existingBenefit._id });
                        continue;
                    }
                }
                // Else -> Create new benefit
                const duplicate = await EmployeeBenefits.findOne({
                    employeeId: employee._id,
                    name,
                    relationship,
                });
                if(duplicate){
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(409).json({
                        message: `Duplicate benefit found for ${name} with relationship ${relationship}`
                    });
                }

                const newBenefit = new EmployeeBenefits({
                    employeeId: employee._id,
                    name,
                    relationship,
                    gender,
                    idNumber,
                    DoB
                });
                await newBenefit.save({ session });
                results.push({ type: 'created', _id: newBenefit._id });
            }

            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({
                message: "Employee benefits saved successfully",
                results
            });

        } catch (error){
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({
                message: "Internal server error",
                error: error.message
            }); 
        }
}

export const getEmployeeBenefits = async (req, res) => {
    const user = req.user;
    if(!user){
        return res.status(401).json({
            message: "Unauthorized access"
        });
    }
    try {
        const employee = await Employees.findOne({ userId: user._id });
        if(!employee){
            return res.status(404).json({
                message: "Employee not found"
            });
        }
        const benefits = await EmployeeBenefits.find({ employeeId: employee._id });
        return res.status(200).json({
            message: "Employee benefits retrieved successfully",
            benefits
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

export const deleteEmployeeBenefit = async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
        return res.status(401).json({
            message: "Unauthorized access"
        });
    }

    if (!id || !mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: "Invalid benefit ID"
        });
    }

    try {
        const employee = await Employees.findOne({ userId: user._id });
        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        const benefit = await EmployeeBenefits.findOneAndDelete({ _id: id, employeeId: employee._id });
        if (!benefit) {
            return res.status(404).json({
                message: "Benefit not found or does not belong to this employee"
            });
        }

        return res.status(200).json({
            message: "Employee benefit deleted successfully",
            id
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}