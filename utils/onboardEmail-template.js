import {FRONTEND_URL} from '../config/config.js'

const genOnboardEmailTemplate = (employee) =>  `
     <div style="font-family: Arial; padding: 20px; background: #f5f7fa;">
      <h2>Welcome to ${employee.companyName}, ${employee.firstName}!</h2>
      <p>Dear <strong>${employee.firstName} ${employee.lastName}</strong>,</p>
      <p>We are excited to have you join us as a <strong>${employee.designation}</strong> in the <strong>${employee.department}</strong> department.</p>
      <p>Your joining date is <strong>${employee.joiningDate}</strong> and your work location is <strong>${employee.workLocation}</strong>.</p>

      <p><strong>please find the below link to loging to our system and onboard:</strong></p>
      <ul>
        <li>URL: ${employee.email}</li>
        <li>Email: ${employee.email}</li>
        <li>password: ${employee.email}</li>
      </ul>

      <p>We look forward to a successful journey together!</p>
      <p>Regards,<br>HR Team<br>${employee.companyName}</p>
    </div>
  `;


  export const emailTemplate = [{
    lable:'add Employee',
    generateSubject:(data)=>`Welcome to ${data.companyName}, ${data.firstName}`,
    generatebody:(data)=>genOnboardEmailTemplate(data),
  }]