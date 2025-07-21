import { config } from "dotenv";

config({path:'.env'});

export const{
    PORT,
    SERVER_URL,
    NODE_ENV,
    DB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    EMAIL_PASSWORD,
    FRONTEND_URL
}=process.env