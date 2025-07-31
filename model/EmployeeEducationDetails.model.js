import mongoose from "mongoose";

const EducationDetilasSchema = new mongoose.Schema({
    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employees',
        required:true
    },
    degree:{
        type:String,
        required:true,
        trim: true
    },
    university:{
        type: String,
        required: true,
        trim: true
    },
    year:{
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear()
    },
    percentage:{
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
},{timestamps: true});

const EmployeeEducationDetails = mongoose.Model('EmployeeEducationDetails',EducationDetilasSchema);

export default EmployeeEducationDetails;