import mongoose from 'mongoose';

const employeeHealthRecordSchema = new mongoose.Schema({
    employee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    bloodGroup: {
        type: String,
        required: true,
    },
    isBloodDonor: {
        type: Boolean,
        default: false,
    },
    allergies: {
        type: String,
        default: '',
    },
    preExistingIllnesses: {
        type: String,
        default: '',
    }, 
    vaccinations:[{
        vaccinationName: {
            type: String,
            required: true,
        },
        dateofDose: {
            type: Date,
            required: true,
        }
    }]
},{timestamps: true});


const EmployeeHealthRecord = mongoose.model("EmployeeHealthRecord",employeeHealthRecordSchema);

export default EmployeeHealthRecord;
