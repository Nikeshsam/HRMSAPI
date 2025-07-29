// index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// import mongoose from 'mongoose';
import { NODE_ENV, PORT } from './config/config.js';
import connectToDatabase from './database/mongodb.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.router.js';
import organizationRouter from './routes/organization.router.js';
import onboardRouter from './routes/onboard.router.js'
import employeeBasicRouter from './routes/employeeBasic.router.js';
import serverless from 'serverless-http';

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use('/api/v1/authentication', authRouter);
app.use('/api/v1/organization', organizationRouter);
app.use('/api/v1/employee', onboardRouter);
app.use('/api/v1/employeeBasic', employeeBasicRouter);

// Connect to DB only once per cold start
if (NODE_ENV === 'production') {
    await connectToDatabase();
}


if (NODE_ENV !== 'production') {
    app.listen(PORT, async () => {
      console.log(`Server running on port ${PORT}`);
      await connectToDatabase();
    });
  }

// No app.listen!
export const handler = serverless(app);
