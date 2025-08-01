import mongoose from "mongoose";

const EmployeeDependentDetailsSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employees',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    relationship: {
        type:String,
        trim: true,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    education: {
        type: String,
        trim: true,
        required: false
    },
    occupation: {
        type: String,
        trim: true,
        required: false
    },
    dependentBenefit:{
        type: Boolean,
        default: false
    }
},{timestamps: true});


EmployeeDependentDetailsSchema.index({ employee: 1 });

const EmployeeDependentDetails = mongoose.model('EmployeeDependentDetails', EmployeeDependentDetailsSchema);

export default EmployeeDependentDetails;