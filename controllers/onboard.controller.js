import Employees from "../model/Employees.model.js";
import User from "../model/User.model.js";
import { generateExcelFromJSON } from "../services/excelExport.service.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import CompanyRegistration from "../model/CompanyRegister.model.js";
import { sendEmail } from "../utils/send-email.js";


export const onboardEmployee = async (req, res)  => {
    const session =  await mongoose.startSession();
    session.startTransaction();
    const {
        employeeId,
        firstName,
        lastName,
        email,
        phoneNumber,
        department,
        designation,
        workLocation,
        employmentType,
        joiningDate,
        employeeType
    } = req.body;
    
    const file = req.file;
    let offerLetter = null;

    if (file) {
        offerLetter = {
        base64: file.buffer.toString('base64'),
        contentType: file.mimetype,
        fileName:file.originalname,
        };
    }

    const user = req.user;
    
    if (!user || !user.company) {
         return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const company = user.company;
    if (!employeeId || !firstName || !lastName || !email || !phoneNumber || !department || !designation || !workLocation || !employmentType || !joiningDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
        

    try{
        const existingEmployee = await Employees.findOne({employeeId});
        
        if(existingEmployee){
            return res.status(400).json({message: 'Employee already onboarded with this ID'});
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'User already exist with the same email'})
        }
        
        const password =employeeId; 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: employeeId,
            email,
            password: hashedPassword,
            role: employeeType,
            company: company,
        });
        await newUser.validate();
        await newUser.save({session});

        const newEmployee = new Employees({
            userId:newUser._id,
            employeeId,
            firstName,
            lastName,
            email,
            phoneNumber,
            department,
            designation,
            workLocation,
            employmentType,
            joiningDate,
            offerLetter
        })
        const {name} = await CompanyRegistration.findById({_id:company});

        await newEmployee.validate(); // Validate the new employee data
        await newEmployee.save({session});
        
        await sendEmail({
            to:email,
            type:'add Employee',
            employee:{
            firstName,
            lastName,
            email,
            phoneNumber,
            department,
            designation,
            workLocation,
            employmentType,
            joiningDate,
            companyName:name
        },
        })
        

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({message: 'Employee onboarded successfully'});
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({error});
    }
}

export const getEmployees = async (req, res) => {
     const user = req.user;
    const { searchTerm = '', page = 1, limit = 10, position = '', department = '', status = ''  } = req.query;
    const company = user?.company;

    if (!user || (!company && user.role !== 'admin')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const users = await User.find({ company }).select('_id').lean();
        if (!users.length) {
            return res.status(404).json({ message: 'No employees found for this company' });
        }

        const userIds = users.map(user => user._id);

        const regex = new RegExp(searchTerm, 'i');
        

        const filter = {
            userId: { $in: userIds },
            ...(searchTerm && {
              $or: [
                { firstName: regex },
                { lastName: regex },
                { email: regex }
              ]
            }),
            ...(position && { designation: position }),
            ...(department && { department }),
            ...(status && { status }),
          };
      
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const parsedLimit = parseInt(limit);

        const [employees, total] = await Promise.all([
            Employees.find(filter).skip(skip).limit(parsedLimit).lean(),
            Employees.countDocuments(filter),
          ]);
      
        // const employees = await Employees.find({
        //     userId: { $in: userIds },
        //     $or: [
        //         { firstName: regex },
        //         { lastName: regex },
        //         { email: regex },
        //     ],
        //     $and: [
        //         position ? { designation: position } : {},
        //         department ? { department } : {},
        //         status ? { status } : {}
        //     ]
        // })
        // .skip(skip)
        // .limit(parseInt(limit));

        // const total = await Employees.countDocuments({
        //     userId: { $in: userIds },
        //     $or: [
        //         { firstName: regex },
        //         { lastName: regex },
        //         { email: regex }
        //     ]
        // });

        return res.status(200).json({
            success: true,
            message: 'Employee data retrieved successfully',
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
            data: employees,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Server error' });
    }

}


export const getEmployee = async (req, res) => {
    const user = req.user;
    const {id} = req.params;
    if(!user || !user.company && user.role !=='admin'){
        return res.status(401).json({message:'Unauthorized'})
    }
    try{
        const employee = await Employees.find({id});
        return res.status(200).json({
            success:true,
            message:'Employee data retrieved successfully',
            data:employee,
        });
    }catch(error){  
        return res.status(500).json({message:error});
    }

}


export const updateEmployee = async(req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const user = req.user;
    const {
        employeeId,
        firstName,
        lastName,
        email,
        phoneNumber,
        department,
        designation,
        workLocation,
        employmentType,
        joiningDate,
        employeeType
    } = req.body;

    const {id} = req.params;
    if(!user || user.role !== 'admin'){
        return res.status(401).json({message:'Unauthorized'});
    }
    try{
        const updatedEmployee = await Employees.findByIdAndUpdate(
            id,
            {
                employeeId,
                firstName,
                lastName,
                email,
                phoneNumber,
                department,
                designation,
                workLocation,
                employmentType,
                joiningDate,
                employeeType
            },
            { new: true, session } 
        );
        if (!updatedEmployee) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Employee not found' });
        }
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({message:'Employee Details Updated Successfully'});
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({message:'server error during update employee details',error});
    }
}

export const deleteEmployee = async(req,res) =>{
    const session = await mongoose.startSession();
    session.startTransaction();
    const user=req.user;
    const {id} = req.params;
    if(!user){
        return res.status(401).json({message:'UnAuthorized'})
    }
    try{
        const emp = await Employees.findOne({_id:id});
        if(!emp){
            await session.abortTransaction();
            await session.endSession();
            return res.status(404).json({message:'Employee with the id not found'});
        }
        const empUserId = emp.userId._id;
        await Employees.findByIdAndDelete(id,{session});
        await User.findByIdAndDelete({_id:empUserId},{session});
        await session.commitTransaction();
        await session.endSession();
        res.status(200).json({message:'Employee deleted Successfully'});
    }catch(error){
        await session.abortTransaction();
        await session.endSession();
        return res.status(500).json({message:'server error during delete employee'});
    }
}

export const exportEmployeesExcel = async (req, res) => {
    const user = req.user;
    const company = user.company;
    if(!user || user.role !=='admin'){
        return res.status(401).json({message:'Unauthorized'})
    }
    try{
        const users= await User.find({company}).select('_id'); // Fetching only user IDs for employees in the company
        if (!users || users.length === 0) {
            return res.status(404).json({message:'No employees found for this company'});
        }
        const userIds = users.map(user => user._id);
        const employees = await Employees.find(
            { userId: { $in: userIds } },
            'employeeId firstName lastName email phoneNumber department designation workLocation employmentType joiningDate status -_id'
        ).lean();

        // Map keys to desired column names with spaces
        const mappedEmployees = employees.map(emp => ({
            'Employee Id': emp.employeeId,
            'First Name': emp.firstName,
            'Last Name': emp.lastName,
            'Email': emp.email,
            'Phone Number': emp.phoneNumber,
            'Department': emp.department,
            'Designation': emp.designation,
            'Work Location': emp.workLocation,
            'Employment Type': emp.employmentType,
            'Joining Date': emp.joiningDate,
            'Status': emp.status
        }));

        const excelBuffer = generateExcelFromJSON(mappedEmployees);
        
        res.setHeader('Content-Disposition', 'attachment; filename=EmployeeData.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);
    }catch(error){  
        return res.status(500).json({message:error});
    }

}
