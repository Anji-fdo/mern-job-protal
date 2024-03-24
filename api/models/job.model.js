import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
      
    },
    skills: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    salary: {
      type: Number,
      required: true,
      
    },
    description: {
        type: String,
        required: true,
        
    },
    location: {
        type: String,
        required: true,
        
    },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;