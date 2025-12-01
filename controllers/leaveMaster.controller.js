import LeaveMaster from '../model/LeaveMaster.model.js';
import mongoose from 'mongoose';


export const createOrUpdateLeaveMaster = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const {
            _id,
            leaveName,
            description,
            leaveCategory,
            genderEligibility,
            monthlyAccrual,
            carryForwardAllowed,
            maxCarryForward,
            allowHalfDay,
            validFrom,
            validTo
        } = req.body;

        const user = req.user;
        if (!user) {
            throw { status: 401, message: "Unauthorized" };
        }

        const company = user.company;
        let leaveMaster;

        if (mongoose.Types.ObjectId.isValid(_id)) {
            //  Update existing leave type
            leaveMaster = await LeaveMaster.findOneAndUpdate(
                { _id, company },
                {
                    leaveName,
                    description,
                    leaveCategory,
                    genderEligibility,
                    monthlyAccrual,
                    carryForwardAllowed,
                    maxCarryForward,
                    allowHalfDay,
                    validFrom,
                    validTo,
                    company,
                    modifiedBy: user._id,
                    modifiedDate: new Date(),
                },
                { new: true, runValidators: true, session }
            );

            if (!leaveMaster) {
                throw { status: 404, message: "LeaveMaster not found" };
            }

        } else {
            //  Check for duplicates
            const existingLeave = await LeaveMaster.findOne({ leaveName, company }).session(session);
            if (existingLeave) {
                throw { status: 400, message: "LeaveMaster with this name already exists" };
            }

            //  Create new leave type
            leaveMaster = new LeaveMaster({
                leaveName,
                description,
                leaveCategory,
                genderEligibility,
                monthlyAccrual,
                carryForwardAllowed,
                maxCarryForward,
                allowHalfDay,
                validFrom,
                validTo,
                company,
                createdBy: user._id,
                createdDate: new Date(),
                status: "Active"
            });

            await leaveMaster.save({ session });
        }

        await session.commitTransaction();

        return res.status(200).json({
            message: "LeaveMaster created/updated successfully",
            leaveMaster
        });

    } catch (error) {
        if (session) await session.abortTransaction();
        return res.status(error.status || 500).json({
            message: error.message || "Internal Server Error",
            error
        });
    } finally {
        if (session) await session.endSession();
    }
};


// Get LeaveMaster(s)
export const getLeaveMaster = async (req, res) => {
    try {

        const user = req.user;
        if (!user) {
            throw { status: 401, message: 'Unauthorized' };
        }
        if (user.company) {
            const leaveMaster = await LeaveMaster.find({ company: user.company });
            if (!leaveMaster) throw { status: 404, message: 'LeaveMaster not found' };
            return res.status(200).json(leaveMaster);
        }
        // Optionally filter by company or other query params
        const leaveMasters = await LeaveMaster.find(req.query);
        return res.status(200).json(leaveMasters);
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || "Internal Server Error",
            error
        });
    }
};

// Delete LeaveMaster
export const deleteLeaveMaster = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw { status: 400, message: 'Valid id required' };
        }
        const result = await LeaveMaster.findByIdAndDelete(id);
        if (!result) throw { status: 404, message: 'LeaveMaster not found' };
        return res.status(200).json({ message: 'LeaveMaster deleted successfully' });
    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || "Internal Server Error",
            error
        });
    }
};
