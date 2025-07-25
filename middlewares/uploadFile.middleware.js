// middlewares/upload.middleware.js
import multer from 'multer';

const storage = multer.memoryStorage();

export const createUploadMiddleware = ({
  fieldName,
  multiple = false,
  maxCount = 1,
  fileSize = 5, // default to 5MB
  fileType //optional
}) =>{
  fileSize = fileSize * 1024 *1024; // Convert MB to bytes
  const fileFilter = (req, file, cb)=>{
    if(!fileType || fileType.length === 0){
      cb(null, true);
    }
    else if(fileType.includes(file.mimetype)){
      cb(null,true);
    }else{
      cb(new Error(`Invalid file type. Allowed type: ${fileType.mimetype}`),false);
    }
};

const upload = multer({
  storage,
  limits: { fileSize },
  fileFilter
});
  return multiple ? upload.array(fieldName, maxCount) : upload.single(fieldName);
}

