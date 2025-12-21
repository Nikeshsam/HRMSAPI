import mongoose from "mongoose";
import LeaveMaster from "../model/LeaveMaster.model.js";
import LeaveApplication from "../model/LeaveApplication.model.js";

export const applyLeave = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { leaveType, startDate, endDate, reason } = req.body;
        const user = req.user;
        if (!user) {
            throw { status: 401, message: "Unauthorized" };
        }
        const company = user.company;
        // Check if leaveType exists and belongs to the user's company
        const leaveMaster = await LeaveMaster.findOne({ _id: leaveType, company });
        if (!leaveMaster) {
            throw { status: 404, message: "Leave type not found" };
        }
        // Create new leave application
        const leaveApplication = new LeaveApplication({
            employee: user._id,
            leaveType,
            startDate,
            endDate,
            reason
        });
        await leaveApplication.save({ session });
        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({ message: "Leave application submitted successfully", leaveApplication });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const cancelLeave = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const user = req.user;
        if (!user) {
            throw { status: 401, message: "Unauthorized" };
        }
        const leaveApplication = await LeaveApplication.findOne({ _id: id, employee: user._id },null, { session });
        if (!leaveApplication) {
            throw { status: 404, message: "Leave application not found" };
        }
        if (leaveApplication.status !== "Pending") {
            throw { status: 400, message: "Only pending leave applications can be cancelled" };
        }
        leaveApplication.status = "Cancelled";
        await leaveApplication.save();
        await session.commitTransaction();
        return res.status(200).json({ message: "Leave application cancelled successfully", leaveApplication });
    } catch (error) {
        await session.abortTransaction();
        return res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
    }finally{
        session.endSession();
    }
};


export const getLeaveApplications = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw { status: 401, message: "Unauthorized" };
        }
        const leaveApplications = await LeaveApplication.find({ employee: user._id }).populate('leaveType');
        return res.status(200).json({ leaveApplications });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
    }
};

export const getLeaveBalance = async (req, res) => {
    try{
        const user = req.user;
        if (!user) {
            throw { status: 401, message: "Unauthorized" };
        }
        // Placeholder logic for leave balance calculation
        const leaveTypes = await LeaveMaster.find({ company: user.company });
        let leaveBalance = {};
        for (const leaveType of leaveTypes) {
            leaveBalance[leaveType.name] = leaveType.balance;
        }
        return res.status(200).json({ leaveBalance });
    }catch(error){
        return res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
    }
}