import mongoose  from "mongoose";


const AddressSchema = new mongoose.Schema({
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, required: true, trim: true },
    city:         { type: String, required: true, trim: true },
    state:        { type: String, required: true, trim: true },
    country:      { type: String, required: true, trim: true },
    zipCode:      { type: String, required: true, trim: true }
}, { _id: false });

const EmployeeContactDetailsSchema = new mongoose.Schema({
    employee:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employees',
            required: true
        },
    primaryMobileNo:{
        type: String,
        required: true,
        match: /^\d{10}$/,
        trim: true
    },
    secondaryMobileNo:{
        type: String,
        match: /^\d{10}$/,
        trim: true
    },
    email:{
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        unique: true,
        trim: true
    },
    currentAddress:{
        type: AddressSchema,
        required: true
    },
    permanentAddress:{
        type: AddressSchema,
        required: true
    },
    relationName:{
        type: String,
        required: true,
        trim: true
    },
    relationship:{
        type: String,
        required: true,
        trim: true
    },
    relationContactNo:{
        type: String,
        required: true,
        match: /^\d{10}$/,
        trim: true
    },
    relationEmail:{
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        trim: true
    },
    relationAddress:{
        type: String,
        trim: true
    }
},{timestamps: true});
    

const EmployeeContactDetails = mongoose.model('EmployeeContactDetails', EmployeeContactDetailsSchema);

export default EmployeeContactDetails;