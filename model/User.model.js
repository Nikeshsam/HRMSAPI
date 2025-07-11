import mongoose from 'mongoose';

const userMasterSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyRegistrationDetails",
        required: true,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minLength: 6,
    },
    confirmPassword: {
    type: String,
    required: [true, 'Confirm Password is required'],
    trim: true,
    minLength: 6,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
        required: true,
    },
});

const User = mongoose.model("UserMaster", userMasterSchema);

export default User;