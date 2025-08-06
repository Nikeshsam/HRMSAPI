import mongoose, { isValidObjectId } from 'mongoose';
import Employees from '../model/Employees.model.js';
import EmployeeDependentDetails from '../model/EmployeeDependentDetails.model.js';

export const createOrUpdateDependentDetails = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const user = req.user;
  const dependents = req.body.dependents; // expecting array

  if (!user) {
    await session.abortTransaction();
    await session.endSession();
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  if (!Array.isArray(dependents) || dependents.length === 0) {
    await session.abortTransaction();
    await session.endSession();
    return res.status(400).json({ message: 'No dependent details provided' });
  }

  try {
    const employee = await Employees.findOne({ userId: user });

    if (!employee) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({ message: 'Employee not found' });
    }

    let results = [];

    for (const dep of dependents) {
      const {
        _id,
        name,
        relationship,
        dateOfBirth,
        education,
        occupation,
        dependentBenefit
      } = dep;

      let existing;

      // If ID is provided → Update flow
      if (_id && mongoose.isValidObjectId(_id)) {
        existing = await EmployeeDependentDetails.findOne({ _id, employee: employee._id });
      }
      if (existing) {
        existing.name = name;
        existing.relationship = relationship;
        existing.dateOfBirth = dateOfBirth;
        existing.education = education;
        existing.occupation = occupation;
        existing.dependentBenefit = dependentBenefit;
        await existing.save({ session });
        results.push({ type: 'updated', _id: existing._id });
        continue;
      }

      // Else → Create flow with duplicate check
      const duplicate = await EmployeeDependentDetails.findOne({
        employee: employee._id,
        name,
        relationship,
        dateOfBirth
      });

      if (duplicate) {
        await session.abortTransaction();
        session.endSession();
        return res.status(409).json({message: `Duplicate dependent found for ${name}`});
      }

      const newDep = new EmployeeDependentDetails({
        employee: employee._id,
        name,
        relationship,
        dateOfBirth,
        education,
        occupation,
        dependentBenefit
      });

      await newDep.validate();
      await newDep.save({ session });
      results.push({ type: 'created', _id: newDep._id });
    }

    await session.commitTransaction();
    await session.endSession();

    return res.status(200).json({
      message: 'Dependent Details Saved Successfully',
      summary: results
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

    const dependents = await EmployeeDependentDetails.find({ employee });

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


export const deleteDependent = async (req,res) => {
  const user = req.user;
  const {id} = req.params;
  
  if(!user){
    return res.status(401).json({ message: 'Unauthorized access' });
  }
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message:'Invalid dependent ID'});
  }

  const dependent = await EmployeeDependentDetails.findOneAndDelete({ _id: id});

  if (!dependent) {
    return res.status(404).json({ message: 'Dependent not found or does not belong to this employee' });
  }

  return res.status(200).json({ message: 'Dependent deleted successfully', dependent });

}