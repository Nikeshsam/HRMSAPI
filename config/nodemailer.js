import nodemailer from 'nodemailer';

import {EMAIL_PASSWORD} from './config.js'

export const accountEmail = 'worksrini255@gmail.com'

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: accountEmail,
        pass: EMAIL_PASSWORD
    }
})

export default transporter;