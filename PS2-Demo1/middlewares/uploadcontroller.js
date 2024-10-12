const path = require('path');
const fs  = require('fs')
const medicalreportcontroller = require('../controllers/medicalreports.js').createMedicalReport
const modelcall = require('./model.js')

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const { filename, mimetype, size } = req.file;
        const imagePath = path.join(__dirname,'..',`/uploads/${filename}`);
        let modeldata = await modelcall(imagePath);
        modeldata.IMAGEPATH = imagePath  
        res.status(200).json(modeldata);
    } catch (error) {
        console.log(error) 
        res.status(500).json({ message: 'An error occurred while uploading the file', error: error.message });
    }
}; 
 
module.exports ={
    uploadImage,
};

 