import { emailTemplate } from "./onboardEmail-template.js";
import transporter,{accountEmail} from "../config/nodemailer.js";


export const sendEmail = async({to,type,employee}) => {
    if(!to || !type) throw new Error('missing required parameters');

    const template = emailTemplate.find((t)=>t.lable==type);

    if(!template) throw new Error('Invalid Email Type');

    const message = template.generatebody(employee);
    const subject = template.generateSubject(employee);

    const mailOptions = {
        from: accountEmail,
        to:to,
        subject:subject,
        html:message,
    }

    transporter.sendMail(mailOptions,(error,info)=>{
        if(error) return console.log(error,'Error sending mail');

        console.log ('Email send: '+ info.response);
    })
}