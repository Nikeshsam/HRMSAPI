import mongoose from 'mongoose';
import Employees from '../model/Employees.model.js';
import EmployeeDependentDetails from '../model/EmployeeDependentDetails.model.js';

export const createOrUpdateDependentDetails = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const user = req.user;
  const {
    name,
    relationship,
    dateOfBirth,
    education,
    occupation,
    dependentBenefit
  } = req.body;

  if (!user) {
    await session.abortTransaction();
    await session.endSession();
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {
    const employee = await Employees.findOne({ userId: user });

    if (!employee) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({ message: 'Employee not found' });
    }

    let dependentDetails = await EmployeeDependentDetails.findOne({
      employee,
      name
    });

    if (dependentDetails) {
      // Update existing record
      dependentDetails.relationship = relationship;
      dependentDetails.dateOfBirth = dateOfBirth;
      dependentDetails.education = education;
      dependentDetails.occupation = occupation;
      dependentDetails.dependentBenefit = dependentBenefit;
      await dependentDetails.save({ session });
    } else {
      // Create new record
      dependentDetails = new EmployeeDependentDetails({
        employee,
        name,
        relationship,
        dateOfBirth,
        education,
        occupation,
        dependentBenefit
      });
      await dependentDetails.validate();
      await dependentDetails.save({ session });
      dependentDetails.wasNew = true;
    }

    await session.commitTransaction();
    await session.endSession();

    return res.status(dependentDetails.isNew?201:200).json({
      message: dependentDetails.isNew
        ? 'Dependent details created successfully'
        : 'Dependent details updated successfully',
      dependentDetails
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getDependentDetails = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {

    const employee = await Employees.findOne({userId: user});

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const dependents = await EmployeeDependentDetails.find({ employee }).populate('employee');

    if (!dependents || dependents.length === 0) {
      return res.status(404).json({ message: 'No dependent details found' });
    }

    return res.status(200).json({
      message: 'Dependent details retrieved successfully',
      dependents
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
