import mongoose from 'mongoose';
import Employees from '../model/Employees.model.js';
import EmployeeEducationDetails from '../model/EmployeeEducationDetails.model.js';

export const createOrUpdateEducationDetails = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const user = req.user;
  const educationDetails = req.body.educationDetails; 

  if (!user) {
    await session.abortTransaction();
    session.endSession();
    return res.status(401).json({ message: 'Unauthorized access' });
  }
  if (!Array.isArray(educationDetails) || educationDetails.length === 0) {
    await session.abortTransaction();
    await session.endSession();
    return res.status(400).json({ message: 'No education details provided' });  
  }
  try {
    const employee = await Employees.findOne({ userId: user });

    if (!employee) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Employee not found' });
    }
    let result = [];
    
    for(const edu of educationDetails){
      const {_id,degree, university, year, percentage} = edu;
      let educationRecord;

      if (_id && mongoose.isValidObjectId(_id)) {
        educationRecord = await EmployeeEducationDetails.findById(_id);
      }

      if (educationRecord) {
        // Update
        educationRecord.degree = degree;
        educationRecord.university = university;
        educationRecord.year = year;
        educationRecord.percentage = percentage;
        await educationRecord.save({ session });
        result.push({ type: 'updated', _id: educationRecord._id });
        continue;
      } 

      // Else -> Create flow with duplicate check
        const duplicate = await EmployeeEducationDetails.findOne({
          degree,
          university,
          year,
        });

        if (duplicate) {
          await session.abortTransaction();
          await session.endSession();
          return res.status(409).json({ message: `Duplicate education record found for ${degree} at ${university} in ${year}` });
        }

        // Create
        educationRecord = new EmployeeEducationDetails({
          employee: employee._id,
          degree,
          university,
          year,
          percentage
        });
        await educationRecord.validate();
        await educationRecord.save({ session });
        result.push({ type: 'created', _id: educationRecord._id });
    }
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({
      message: 'Education Details Saved Successfully',
      summary: result
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getEducationDetails = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {

    const employee = await Employees.findOne({userId: user});

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const educationRecords = await EmployeeEducationDetails.find({ employee });

    if (!educationRecords || educationRecords.length === 0) {
      return res.status(404).json({ message: 'No education details found' });
    }

    return res.status(200).json({
      message: 'Education details retrieved successfully',
      educationDetails:educationRecords
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


export const deleteEmployeeEducation = async(req, res) => {
  const user = req.user;
  const {id} = req.params;
  if(!user){
    return res.status(401).json({message:'Unauthorized access'});
  }
  try{
    const employeeEducation = await EmployeeEducationDetails.findOneAndDelete({_id:id});
    if(!employeeEducation){
      return res.status(404).json({message:'Education Details Not Found'});
    }
    return res.status(200).json({message:'Education Detail deleted successfully'})
  }catch(error){
    return res.status(500).json({message:'Internal Server error',error:error.message});
  }
}