const MedicalRecord = require('../model/Medicalrecord');

const updateDocument = async (req, res) => {
    try {
        const { imagePath, ...updatedData } = req.body;
 
        if (!imagePath) {
            return res.status(400).json({ message: 'imagePath is required to update the document' });
        }

        // updatedData.URL = result.secure_url;
        const saveddoc = await createMedicalReport(updatedData);
 
        res.status(200).json({ message: 'Document updated successfully', saveddoc });
    } catch (error) {
        console.error('Error updating document:', error); 
        res.status(500).json({ message: 'Server error' }); 
    }
};
 
async function createMedicalReport(data) {
    try {
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Data object is required and cannot be empty');
      }
  
      const query = { ...data };
      delete query._id;
  
      let existingRecord = await MedicalRecord.findOne(query);
  
      let savedRecord;
  
      if (existingRecord) {
        // If a matching record exists, update it
        existingRecord.set(data);
        savedRecord = await existingRecord.save();
      } else {
        // If no matching record exists, create a new one
        const newRecord = new MedicalRecord(data);
        savedRecord = await newRecord.save();
      }
  
      const returnRecord = savedRecord.toJSON();
      returnRecord._id = savedRecord._id.toString();
  
      return returnRecord;
    } catch (error) {
      console.error('Error creating or updating medical record:', error);
      throw error;
    }
  }

module.exports = {
    updateDocument,
    createMedicalReport
}
