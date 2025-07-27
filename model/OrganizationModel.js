import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyRegistrationDetails",
        required: true,
    },
    organizationName:{
        type: String,
        required: [true, 'Organization Name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    companyLogo: {
        base64: String,
        contentType: String,
        fileName:String,
    },
    industry:{
        type: String,
        required: [true, 'Industry is required'],
        trim: true,
        maxLength: 100,
    },
    businessType: {
        type: String,
        required: [true, 'Business Type is required'],
        trim: true,
        maxLength: 100,
    },
    companyAddress: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        minLength: 5,
        maxLength: 500,
    },
    street:{
        type: String,
        required: [true, 'Street is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    city:{
        type: String,
        required: [true, 'City is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    state:{
        type: String,
        required: [true, 'State is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    country:{
        type: String,
        required: [true, 'country is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    zipCode:{
        type: String,
        required: [true, 'Zip Code is required'],
        trim: true,
        minLength: 5,
        maxLength: 10,
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone Number is required'],
        trim: true,
        match: [/^\d{10}$/, 'Please use a valid phone number'],
    },
    faxNumber:{
        type: String,
        required: [true, 'Fax Number is required'],
        trim: true,
    },
    website:{
        type: String,
        required: [true, 'Website URL is required'],
        trim: true,
        match: [/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/, 'Please use a valid URL'],
    },
    fiscal:{
        type: String,
        required: [true, 'Fiscal Year is required'],
        trim: true,
        maxLength: 100,
    },
    timeZone: {
        type: String,
        required: [true, 'Time Zone is required'],
        trim: true,
        maxLength: 100,
    },  
    taxMethod:{
        type: String,
        trim: true,
        maxLength: 100,
    },
    taxID:{
        type: String,
        required: [true, 'Tax ID is required'],
        trim: true,
        maxLength: 100,
    },
    dateFormat:{
        type: String,
        trim: true,
        maxLength: 50,
    },
    companyID:{
        type: String,
        required: [true, 'Company ID is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
        unique: true, // Ensure companyId is unique
    }
});
const Organization = mongoose.model('OrganizationDetails', OrganizationSchema);
export default Organization;