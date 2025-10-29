import mongoose from "mongoose";

const leaveMasterSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyRegistrationDetails",
        required: true
    },
    leaveName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    leaveCategory: {
        type: String,
        enum: ["Paid", "Unpaid", "Special", "Maternity", "Other"],
        required: true
    },
    genderEligibility: {
        type: String,
        enum: ["All", "Male", "Female", "Other"],
        default: "All"
    },
    monthlyAccrual: {
        type: Boolean,
        default: false
    },
    carryForwardAllowed: {
        type: Boolean,
        default: false
    },
    maxCarryForward: {
        type: Number,   // ✅ Decimal128 is rarely needed here
        default: 0,
        max:100,
    },
    allowHalfDay: {
        type: Boolean,
        default: false
    },
    validFrom: {
        type: Date,
        default: Date.now
    },
    validTo: {
        type: Date
    },
    // ✅ Optional but very useful fields:
    encashmentAllowed: {
        type: Boolean,
        default: false
    },
    maxEncashableDays: {
        type: Number,
        default: 0
    },
    requiresApproval: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

// ✅ Add a unique constraint per company (no duplicate leave names)
leaveMasterSchema.index({ company: 1, leaveName: 1 }, { unique: true });

const LeaveMaster = mongoose.model("LeaveMaster", leaveMasterSchema);

export default LeaveMaster;
