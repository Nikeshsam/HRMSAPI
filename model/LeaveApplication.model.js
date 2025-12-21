import mongoose from 'mongoose';

const leaveApplicationSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    leaveType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LeaveMaster',
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate:{
        type: Date,
        required: true
    },
    reason:{
        type: String,
        trim: true
    },
    status:{
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
        default: 'Pending'
    },
});

const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);

export default LeaveApplication;