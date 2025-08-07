import mongoose from "mongoose";

const employeeBenefitsSchema = new mongoose.Schema({
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Employee", 
    required: true
 },
  name: { 
    type: String, 
    trim:true,
    required: true 
},
    relationship: { 
    type: String, 
    required: true 
},
    gender: { 
    type: String, 
    required: true 
},
    idNumber: { 
    type: String, 
    required: true 
},
    DoB: { 
    type: Date, 
    required: true ,
    format: "DD-MM-YYYY"
}

},{timestamps: true});

const EmployeeBenefits = mongoose.model("EmployeeBenefits", employeeBenefitsSchema);

export default EmployeeBenefits;
