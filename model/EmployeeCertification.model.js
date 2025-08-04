import mongoose from "mongoose";


const employeeCertificationSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    issuedBy:{
        type:String,
        trim:true,
        required:true
    },
    issuedDate:{
        type:Date,
        trim:true,
        required:true
    },
    expiryDate:{
        type:Date,
        trim:true,
        required:true
    },
    additionalInfo:{
        type:String,
        trim:true,
        required:true
    }
},{timestamps:true});


const EmployeeCertification = mongoose.model('EmployeeCertification',employeeCertificationSchema);

export default EmployeeCertification;

