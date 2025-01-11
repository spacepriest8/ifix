const Job = require('../../models/jobpost');
const User = require('../../models/user');

// Client posts a new job
const createJob = async (req, res) => {
  const {title, location, category} = req.body;  // Include title in the request body
  const clientId = req.user.id;

  if (!title || !location || !category) {  // Validate the input
    return res.status(400).json({ message: 'Please provide job title, location, and category' });
  }
          
  try {
    const job = new Job({
      title,        // Save title when posting job
      location,
      category,     // Save category when posting job
      clientId,
      status: 'pending',  // Default status is pending
    });

    await job.save();
    res.status(201).json({ message: 'Job posted successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error while posting job', error });
  }
};


// Client views all jobs they've posted
const getClientJobs = async (req, res) => {
  try {
    const clientJobs = await Job.find({ clientId: req.user.id });
    res.status(200).json(clientJobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching jobs', error });
  }
};

// Service provider views available jobs
const getAvailableJobs = async (req, res) => {
  try {
    const availableJobs = await Job.find({ status: 'pending' });
    res.status(200).json(availableJobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching available jobs', error });
  }
};

// Service provider applies for a job
const applyForJob = async (req, res) => {
  const { jobId } = req.params;   // jobTitle from URL params
  const serviceProviderId = req.user.id;

  try {
    const job = await Job.findById(jobId);  // Find the job by title

    if (!job || job.status !== 'pending') {
      return res.status(400).json({ message: 'Job is no longer available' });
    }

    job.serviceProviderId = serviceProviderId;
    await job.save();

    res.status(200).json({ message: 'You have applied for the job successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error while applying for the job', error });
  }
};


// Get jobs by category
const getJobsByCategory = async (req, res) => {
  const { category } = req.params;

  const validCategories = ['Washing', 'Cleaning', 'Errands', 'Home Help Out', 'Occasion Help'];

  // Case-insensitive check for category match
  if (!validCategories.some(validCategory => validCategory.toLowerCase() === category.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  try {
    // Perform a case-insensitive query using a regular expression
    const jobs = await Job.find({
      category: { $regex: new RegExp('^' + category + '$', 'i') } // 'i' for case-insensitive
    });

    if (jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found for this category' });
    }

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching jobs by category', error });
  }
};


// Client pairs with a service provider
const pairServiceProvider = async (req, res) => {
  const { jobId, serviceProviderId } = req.body;  // Use jobId to uniquely identify the job

  try {
    const job = await Job.findById(jobId);  // Use the job's ID (MongoDB _id) to find the job

    if (!job) {
      return res.status(400).json({ message: 'Job with the given ID does not exist' });
    }

    if (job.clientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to modify this job' });
    }

    job.serviceProviderId = serviceProviderId;
    job.status = 'accepted';
    await job.save();

    res.status(200).json({ message: 'Service provider paired with job', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error while pairing service provider', error });
  }
};


// const pairServiceProvider = async (req, res) => {
//   const { jobTitle, serviceProviderId } = req.body; // jobTitle instead of jobId

//   try {
//     const job = await Job.findOne({ title: jobTitle });

//     if (!job || job.clientId.toString() !== req.user.id) {
//       return res.status(400).json({ message: 'Invalid job or you are not the client' });
//     }
    
// console.log({
//   jobTitle,
//   serviceProviderId,
// });

//     job.serviceProviderId = serviceProviderId;
//     job.status = 'accepted'; // Mark job as accepted when paired
//     await job.save();

//     res.status(200).json({ message: 'Service provider paired with job', job });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error while pairing service provider', error });
//   }
// };


// Client marks a job as completed
const completeJob = async (req, res) => {
  const { jobId } = req.body;

  try {
    const job = await Job.findById(jobId);

    if (!job || job.clientId.toString() !== req.user.id) {
      return res.status(400).json({ message: 'Invalid job or you are not the client' });
    }

    job.status = 'completed'; // Mark job as completed
    await job.save();

    res.status(200).json({ message: 'Job marked as completed', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error while completing the job', error });
  }
};

module.exports = {
  createJob,
  getClientJobs,
  getAvailableJobs,
  applyForJob,
  pairServiceProvider,
  getJobsByCategory,
  completeJob,
};
