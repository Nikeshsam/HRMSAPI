import User from "../model/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/config.js";
import CompanyRegistration from "../model/CompanyRegister.model.js";
import mongoose from "mongoose";


export const registerCompany = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { name, email, organizationName, password, confirmPassword } = req.body;

    if (!name || !email || !organizationName || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const existingCompany = await CompanyRegistration.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ message: 'Company already registered with this email' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newCompany = new CompanyRegistration({
            name,
            email,
            organizationName
        });
        
        await newCompany.save({session});

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role:"admin",
            company: newCompany._id
        });

        await newUser.save({session});
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ message: 'Company registered successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
}

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const {companyProfileStatus} = await CompanyRegistration.findById(user.company);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

       const token = jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});

        res.status(200).json({
            success:true,
            message: "Login successful",
            data:{
                token,
                user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            companyProfileStatus
            }
           
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const validateUser = async(req,res)=>{
    try {
        // User and token are already set by the authorize middleware
        const user = req.user;
        const token = req.token;
        const {company} = user;
        const {companyProfileStatus} = await CompanyRegistration.findById(company);
        res.status(200).json({
            success: true,
            message: "User validated successfully",
            data:{
                token,
                user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            companyProfileStatus
        }
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}