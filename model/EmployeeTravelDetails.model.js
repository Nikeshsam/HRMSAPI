import mongoose from 'mongoose';


const employeeTravelDetailsSchema = new mongoose.Schema({
    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employees',
        required:true
    },
    passportNo:{
        type:String,
        required:true,
        trim:true
    },
    issuedBy:{
        type:String,
        required:true,
        trim:true
    },
    issueDate:{
        type:Date,
        required:true
    },
    expiryDate:{
        type:Date,
        required:true
    },
    visaDetails:[{
        visaNumber:{
            type:String,
            required:true,
            trim:true
        },
        issuedDate:{
            type:Date,
            required:true
        },
        placeOfIssue:{
            type:String,
            required:true,
            trim:true
        }, 
        expiryDate:{
            type:Date,
            required:true
        },
        notes:{
            type:String,
            default:'',
            trim:true
        }
    }]
});


const EmployeeTravelDetails = mongoose.model("EmployeeTravelDetails",employeeTravelDetailsSchema);

export default EmployeeTravelDetails;