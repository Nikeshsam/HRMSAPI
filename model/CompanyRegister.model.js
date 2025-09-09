import mongoose from "mongoose";

const companyRegisterSchema = new mongoose.Schema({
name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minLength: 2,
    maxLength: 100,
},
empSeq:{
    type:Number,
    default:0,
},
email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
},
organizationName: {
    type: String,
    required: [true, 'Organization Name is required'],
    trim: true,
    minLength: 2,
    maxLength: 100,
},
companyProfileStatus:{
    type:Boolean,
    default:false,
}
});
const CompanyRegistration = mongoose.model('CompanyRegistrationDetails',companyRegisterSchema);

export default CompanyRegistration;