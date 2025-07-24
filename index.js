import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// import mongoose from 'mongoose';
import { PORT } from './config/config.js';
import connectToDatabase from './database/mongodb.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.router.js';
import organizationRouter from './routes/organization.router.js';
import onboardRouter from './routes/onboard.router.js'
import employeeBasicRouter from './routes/employeeBasic.router.js';
const app=express();

app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(express.json()); //handle json data
app.use(express.urlencoded({extended:true})); //handle form data send via html forms
app.use(cors());
app.use(cookieParser()); //handle cookies

app.use('/api/v1/authentication',authRouter);
app.use('/api/v1/organization',organizationRouter);
app.use('/api/v1/employee',onboardRouter);
app.use('/api/v1/employeeBasic',employeeBasicRouter);


app.listen(PORT,async()=>{
    console.log(`Server Running in port:${PORT}`);
    await connectToDatabase();
})

