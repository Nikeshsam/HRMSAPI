import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
   firstName:{
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    lastName:{
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phoneNumber:{
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Phone number must be 10 digits'],
        trim: true
    },
    department:{
        type: String,
        required: true,
        trim: true
    },
    designation:{
        type: String,
        required: true,
        trim: true
    },
    workLocation:{  
        type: String,
        required: true,
        trim: true
    },
    employmentType:{
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        required: true
    },
    joiningDate:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        enum: ['Pending', 'Completed', 'Rejected'],
        default: 'Pending'
    }
   
})


const Employees  = mongoose.model('Employees', employeeSchema);

export default Employees;