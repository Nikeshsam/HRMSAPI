import mongoose from "mongoose";

const employeeBasicDetailsSchema = new mongoose.Schema({
    employee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employees',
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    dateOfBirth:{
        type: Date,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    nationality:{
        type: String,
        required: true,
        trim: true
    },
    gender:{
        type:String,
        require:true
    },
    maritualStatus:{
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'Widowed'],
        required: true
    },
    dateOfMarriage:{
        type: Date,
        required: false
    }
});


const EmployeeBasicDetails = mongoose.model('EmployeeBasicDetails', employeeBasicDetailsSchema);


export default EmployeeBasicDetails;