import Employees from "../model/Employees.model";
import User from "../model/User.model";

export const onboardEmployee = async (req, res)  => {
    const session =  await mongoose.startSession()
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

        const password =employeeId; 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
            role: employeeType,
            company: company,
        });

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
            joiningDate
        })
    

        await newEmployee.validate(); // Validate the new employee data
        await newEmployee.save({session});
        
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({message: 'Employee onboarded successfully'});
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({message:error});
    }
}

export const getEmployees = async (req, res) => {
    const user = req.user;
    const company = user.company;
    if(!user || !user.company && user.role !=='admin'){
        return res.status(401).json({message:'Unauthorized'})
    }
    try{
        const users= await User.find({company}).select('_id'); // Fetching only user IDs for employees in the company
        if (!users || users.length === 0) {
            return res.status(404).json({message:'No employees found for this company'});
        }
        const userIds = users.map(user => user._id);
        const employees = await Employees.find({userId: {$in: userIds}})
        return res.status(200).json({
            success:true,
            message:'Employee data retrieved successfully',
            data:employees,
        });
    }catch(error){  
        return res.status(500).json({message:error});
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
        return res.status(500).json({message:'server error during update employee details'});
    }
}

export const deleteEmployee = async(req,res) =>{
    const user=req.user;
    const {id} = req.params;
    if(!user){
        return res.status(401).json({message:'UnAuthorized'})
    }
    try{
        await Employees.findByIdAndDelete(id);
        res.status(200).json({message:'Employee deleted Successfully'});
    }catch(error){
        return res.status(500).json({message:'server error during delete employee'});
    }
}

export const searchEmployees = async (req, res) => {
    const user = req.user;
    const {searchTerm} = req.body;
    const company = user.company;
    if(!user || !user.company && user.role !=='admin'){
        return res.status(401).json({message:'Unauthorized'})
    }
    try{
        const users= await User.find({company}).select('_id'); // Fetching only user IDs for employees in the company
        if (!users || users.length === 0) {
            return res.status(404).json({message:'No employees found for this company'});
        }
        const userIds = users.map(user => user._id);
        const employees = await Employees.find({userId: {$in: userIds}});
        const filteredEmployees = employees.filter(employee => {
            return (
                employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.email.toLowerCase().includes(searchTerm.toLowerCase()) 
            )
        })
        return res.status(200).json({
            success:true,
            message:'Employee data retrieved successfully',
            data:employees,
        });
    }catch(error){  
        return res.status(500).json({message:error});
    }

}