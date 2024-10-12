const mongoose = require('mongoose');

// Create a completely dynamic schema with no predefined fields
const medicalRecordSchema = new mongoose.Schema({}, {
  strict: false,   
  timestamps: true  
});

// Remove MongoDB-specific fields from the output 
medicalRecordSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
module.exports = MedicalRecord;