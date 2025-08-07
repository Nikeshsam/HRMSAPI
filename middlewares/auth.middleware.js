import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../config/config.js';
import User from '../model/User.model.js';

const authorize=async (req, res, next) => {
    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token=req.headers.authorization.split(' ')[1];
            //verify token
        }
        if(!token){
            const error=new Error('Not authorized to access this route');
            error.statusCode=401;
            throw error;
        }
        //verify token
        const decoded=jwt.verify(token,JWT_SECRET);
        const user = await User.findById(decoded.userId); // Use the imported User model
        // const user=await user.findById(decoded.userId);
        if(!user){
            res.status(401).json({
                message:'Unauthorized',
            });
        }
        req.user=user;
        req.token=token;
        //verify token
        next();
    }catch(error){
        res.status(401).json({
            error:error.message,
            message:'Unauthorized',
        });
    }
}

export default authorize;