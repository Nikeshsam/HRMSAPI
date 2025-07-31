import mongoose from 'mongoose';
import Employees from '../model/Employees.model.js';
import EmployeeEducationDetails from '../model/EmployeeEducationDetails.model.js';

export const createOrUpdateEducationDetails = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const user = req.user;
  const {
    degree,
    university,
    year,
    percentage
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

    // Check if the education record with the same degree and university exists
    let educationRecord = await EmployeeEducationDetails.findOne({ employee, degree, university });

    if (educationRecord) {
      // Update
      educationRecord.year = year;
      educationRecord.percentage = percentage;
      await educationRecord.save({ session });
    } else {
      // Create
      educationRecord = new EmployeeEducationDetails({
        employee,
        degree,
        university,
        year,
        percentage
      });
      await educationRecord.validate();
      await educationRecord.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: educationRecord.isNew
        ? 'Education details created successfully'
        : 'Education details updated successfully',
      educationRecord
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getEducationDetails = async (req, res) => {
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

    const educationRecords = await EmployeeEducationDetails.find({ employee }).populate('employee');

    if (!educationRecords || educationRecords.length === 0) {
      return res.status(404).json({ message: 'No education details found' });
    }

    return res.status(200).json({
      message: 'Education details retrieved successfully',
      educationRecords
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
