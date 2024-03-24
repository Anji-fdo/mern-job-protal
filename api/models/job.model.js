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
    skills: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    salary: {
      type: Number,
      required: false,
      
    },
    description: {
        type: String,
        required: false,
        
    },
    location: {
        type: String,
        required: false,
        
    },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;