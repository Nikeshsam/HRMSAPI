import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import serverless from 'serverless-http';

import { PORT } from './config/config.js';
import connectToDatabase from './database/mongodb.js';

import authRouter from './routes/auth.router.js';
import organizationRouter from './routes/organization.router.js';
import onboardRouter from './routes/onboard.router.js';
import employeeBasicRouter from './routes/employeeBasic.router.js';

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Routes
app.use('/api/v1/authentication', authRouter);
app.use('/api/v1/organization', organizationRouter);
app.use('/api/v1/employee', onboardRouter);
app.use('/api/v1/employeeBasic', employeeBasicRouter);

// Optional root route for testing
app.get('/api/', (req, res) => {
  res.send("API is live ✅");
});

// Ensure DB connects only once (Vercel cold start safe)
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connectToDatabase();
    isConnected = true;
    console.log("Connected to database (production mode)");
  }
  next();
});

// ✅ THIS IS THE CORRECT EXPORT FOR VERCEL
export default serverless(app);
