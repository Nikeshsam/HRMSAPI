import mongoose from  'mongoose';

const employeeExperienceSchema = new mongoose.Schema({
    employee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employees',
        required: true
    },
    organization:{
        type:String,
        trim:true,
        required:true,
        maxLength:100
    },
    location:{
        type:String,
        trim:true,
        required:true,
        maxLength:400
    },
    jobTitle:{
        type:String,
        trim:true,
        required:true,
        maxLength:150,
    },
    startDate:{
        type:Date,
        required:true,
        format: 'DD-MM-YYYY'
    },
    endDate:{
        type:Date,
        required:true,
        format: 'DD-MM-YYYY'
    },
},{timestamps:true});

const EmployeeExperience = mongoose.model('EmployeeExperience',employeeExperienceSchema);

export default EmployeeExperience;