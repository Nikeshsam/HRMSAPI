import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema({
    holidayname: {
        type: String,
        required: true
    },
    holidaydate: {
        type: Date,
        required: true
    },
    description: {
        type: String
    },
    restrictedHoliday: {
        type: String,
        default: "No"
    },
    holidayday: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyRegistrationDetails",
        required: true
    }
}, { timestamps: true });

const Holiday = mongoose.model("Holiday", holidaySchema);

export default Holiday;
