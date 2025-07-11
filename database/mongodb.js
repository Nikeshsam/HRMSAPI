import mongoose from "mongoose";

import{DB_URI,NODE_ENV} from '../config/config.js';

if(!DB_URI){
    throw new Error('Please define mongodb uri');
}


const connectToDatabase =async()=>{
    try{
        await mongoose.connect(DB_URI);
        
        console.log(`Connected to database ${NODE_ENV} mode`);
    }catch(err){
        console.error("Error connecting database: ",err);
        process.exit(1);
    }
}

export default connectToDatabase;