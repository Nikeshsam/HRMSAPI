import CompanyRegistration from "../model/CompanyRegister.model.js";
import Organization from "../model/OrganizationModel.js";


export const insertOrganizationDetails = async (req, res) => {
    const {
        organizationName,
        industry,
        businessType,
        companyAddress,
        street,
        city,
        state,
        zipCode,
        phoneNumber,
        faxNumber,
        websiteURL,
        fiscalYear,
        timeZone,
        taxId,
        companyId
    } = req.body;
    
    const user = req.user;
    if (!user || !user.company) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const company = user.company; 

    if(!organizationName || !industry || !businessType || !companyAddress || !street || !city || !state || !zipCode || !phoneNumber || !faxNumber || !websiteURL || !fiscalYear || !timeZone || !taxId) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try{
        const existOrganization= await Organization.findOne({companyId});
        if(existOrganization) {
            return res.status(400).json({ message: 'Organization already exists' });
        }

        const newOrganization = new Organization({
            company,
            organizationName,
            industry,
            businessType,
            companyAddress,
            street,
            city,
            state,
            zipCode,
            phoneNumber,
            faxNumber,
            websiteURL,
            fiscalYear,
            timeZone,
            taxId,
            companyId
        });

        await newOrganization.save();
        return res.status(201).json({ message: 'Organization details inserted successfully', organization: newOrganization });

    }catch(error) {
        return res.status(500).json({ error:error });
    }
}