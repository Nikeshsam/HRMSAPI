import mongoose from "mongoose";
import Employees from "../model/Employees.model.js";
import EmployeeTravelDetails from "../model/EmployeeTravelDetails.model.js";

export const createOrUpdateEmployeeTravelDetails = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const user = req.user;
    const { passportNo, issuedBy, issueDate, expiryDate, visaDetails } = req.body;
    if (!user) {
        throw { status: 401, message: 'Unauthorized access' };
    }
    if (!passportNo || !issuedBy || !issueDate || !expiryDate || !Array.isArray(visaDetails) || visaDetails.length === 0) {
        throw { status: 400, message: 'Incomplete travel details data' };
    }
    try {
        const employee = await Employees.findOne({ userId: user });
        if (!employee) {
            throw { status: 404, message: 'Employee not found' };
        }
        for(const visa of visaDetails){
            if(!visa.visaNumber || !visa.issuedDate || !visa.placeOfIssue || !visa.expiryDate){
                throw { status: 400, message: 'Incomplete visa data' };
            }

            if(visa._id && mongoose.isValidObjectId(visa._id)){
                continue;
            }
            const duplicate = await EmployeeTravelDetails.findOne({
                employee: employee._id,
                visaDetails: {
                    $elemMatch: {
                        visaNumber: visa.visaNumber,
                        issuedDate: visa.issuedDate,
                        placeOfIssue: visa.placeOfIssue,
                        expiryDate: visa.expiryDate
                    }
                }
            });
            if(duplicate) {
                 throw {
                    status: 400,
                    message: `Duplicate visa record found for ${visa.visaNumber} on ${visa.issuedDate}`
                };
            }
        }

        let travelRecord = await EmployeeTravelDetails.findOne({ employee: employee._id });
        let wasNew = false;

        if (travelRecord) {
            travelRecord.passportNo = passportNo;
            travelRecord.issuedBy = issuedBy;
            travelRecord.issueDate = issueDate;
            travelRecord.expiryDate = expiryDate;
            travelRecord.visaDetails = visaDetails;
            for (const visa of visaDetails) {
                if (visa._id && mongoose.isValidObjectId(visa._id)) {
                    const existing = travelRecord.visaDetails.id(visa._id);
                    if (existing) {
                        existing.visaNumber = visa.visaNumber;
                        existing.issuedDate = visa.issuedDate;
                        existing.placeOfIssue = visa.placeOfIssue;
                        existing.expiryDate = visa.expiryDate;
                        existing.notes = visa.notes || '';
                    }
                } else {
                    travelRecord.visaDetails.push({
                        visaNumber: visa.visaNumber,
                        issuedDate: visa.issuedDate,
                        placeOfIssue: visa.placeOfIssue,
                        expiryDate: visa.expiryDate,
                        notes: visa.notes || ''
                    });
                }
            }
            await travelRecord.save({ session });
        }
        else {
            travelRecord = new EmployeeTravelDetails({
                employee: employee._id,
                passportNo,
                issuedBy,
                issueDate,
                expiryDate,
                visaDetails
            });
            await travelRecord.save({ session });
            wasNew = true;
        }
        await session.commitTransaction();
        session.endSession();

        return res.status(wasNew?201:200).json({ message: `Employee travel record ${wasNew?'created':'updated'} successfully`, travelRecord });
    }catch(error) {
        await session.abortTransaction();
        session.endSession();
        const status = error.status || 500;
        const message = error.message || 'Internal server error';
        return res.status(status).json({ message, error });
    }
};



export const getEmployeeTravelRecord = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
    try {
        const employee = await Employees.findOne({ userId: user });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const travelRecord = await EmployeeTravelDetails.findOne({ employee: employee._id });
        if (!travelRecord) {
            return res.status(404).json({ message: 'Travel record not found' });
        }
        return res.status(200).json({ message: 'Travel record retrieved successfully', travelRecord });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};


export const deleteEmployeeVisaDetails = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    if (!user) {
        throw { status: 401, message: 'Unauthorized access' };
    }
    if (!id || !mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid visa ID' });
    }
    try {
        const employee = await Employees.findOne({ userId: user });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const travelRecord = await EmployeeTravelDetails.findOne({ employee: employee._id });
        if (!travelRecord) {
            return res.status(404).json({ message: 'Travel record not found' });
        }
        const visa = travelRecord.visaDetails.id(id);
        if (!visa) {
            return res.status(404).json({ message: 'Visa details not found' });
        }
        visa.deleteOne();
        await travelRecord.save();
        return res.status(200).json({ message: 'Visa details deleted successfully' });
    } catch(error) {
        const status = error.status || 500;
        const message = error.message || 'Internal server error';
        return res.status(status).json({ message, error });
    }
};
