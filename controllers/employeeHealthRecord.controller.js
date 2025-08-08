import mongoose from "mongoose";
import Employees from "../model/Employees.model.js";
import EmployeeHealthRecord from "../model/EmployeeHelthRecord.model.js";

export const createOrUpdateEmployeeHealthRecord = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const user = req.user;
    const {bloodGroup, isBloodDonor, allergies, preExistingIllnesses, vaccinations } = req.body;
    if (!user) {
        throw { status: 401, message: 'Unauthorized access' };
    }
    if (!bloodGroup || !Array.isArray(vaccinations) || vaccinations.length === 0) {
        throw { status: 400, message: 'Incomplete health record data' };
    }
    try {
        const employee = await Employees.findOne({ userId: user });
        if (!employee) {
            throw { status: 404, message: 'Employee not found' };
        }
        for(const vac of vaccinations){
            if(!vac.vaccinationName || !vac.dateofDose){
                throw { status: 400, message: 'Incomplete vaccination data' };
            }
                
            if(vac._id && mongoose.isValidObjectId(vac._id)){
                continue;
            }
            const duplicate = await EmployeeHealthRecord.findOne({
                employee: employee._id,
                vaccinations: {
                    $elemMatch: {
                        vaccinationName: vac.vaccinationName,
                        dateofDose: vac.dateofDose
                    }
                }
            });
            if(duplicate) {
                 throw {
                    status: 400,
                    message: `Duplicate vaccination record found for ${vac.vaccinationName} on ${vac.dateofDose}`
                };
            }
        }

        let healthRecord = await EmployeeHealthRecord.findOne({ employee: employee._id });
        let wasNew = false;

        if (healthRecord) {
            healthRecord.bloodGroup = bloodGroup;
            healthRecord.isBloodDonor = isBloodDonor;
            healthRecord.allergies = allergies;
            healthRecord.preExistingIllnesses = preExistingIllnesses;
            for (const vac of vaccinations) {
                if (vac._id && mongoose.isValidObjectId(vac._id)) {
                    const existing = healthRecord.vaccinations.id(vac._id);
                    if (existing) {
                        existing.vaccinationName = vac.vaccinationName;
                        existing.dateofDose = vac.dateofDose;
                        existing.placeOfIssue = vac.placeOfIssue;
                        existing.expiryDate = vac.expiryDate;
                        existing.notes = vac.notes || '';
                    }
                } else {
                    healthRecord.vaccinations.push({
                        vaccinationName: vac.vaccinationName,
                        dateofDose: vac.dateofDose,
                        placeOfIssue: vac.placeOfIssue,
                        expiryDate: vac.expiryDate,
                        notes: vac.notes || ''
                    });
                }
            }
            await healthRecord.save({ session });
        }
        else {
            healthRecord = new EmployeeHealthRecord({
                employee: employee._id,
                bloodGroup,
                isBloodDonor,
                allergies,
                preExistingIllnesses,
                vaccinations
            });
            await healthRecord.save({ session });
            wasNew = true;
        }
        await session.commitTransaction();
        session.endSession();

        return res.status(wasNew?201:200).json({ message: `Employee health record ${wasNew?'created':'updated'} successfully`, healthRecord });
    }catch(error) {
        await session.abortTransaction();
        session.endSession();
        const status = error.status || 500;
        const message = error.message || 'Internal server error';
        return res.status(status).json({ message, error });
    }
};



export const getEmployeeHealthRecord = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const employee = await Employees.findOne({ userId: user });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const healthRecord = await EmployeeHealthRecord.findOne({ employee: employee._id });
        if (!healthRecord) {
            return res.status(404).json({ message: 'Health record not found' });
        }
        return res.status(200).json({ message: 'Health record retrieved successfully', healthRecord });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};


export const deleteEmployeeVaccinationRecord = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    if (!user) {
        throw { status: 401, message: 'Unauthorized access' };
    }
    if (!id || !mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid vaccination record ID' });
    }
    try {
        const employee = await Employees.findOne({ userId: user });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const healthRecord = await EmployeeHealthRecord.findOne({ employee: employee._id });
        if (!healthRecord) {
            return res.status(404).json({ message: 'Health record not found' });
        }
        const vaccination = healthRecord.vaccinations.id(id);
        if (!vaccination) {
            return res.status(404).json({ message: 'Vaccination record not found' });
        }
        vaccination.deleteOne();
        await healthRecord.save();
        return res.status(200).json({ message: 'Vaccination record deleted successfully' });
    } catch(error) {
        const status = error.status || 500;
        const message = error.message || 'Internal server error';
        return res.status(status).json({ message, error });
    }
};
