import Job from '../models/job.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
  if (!req.user.isEmp) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }
  if (!req.body.title || !req.body.companyName ) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
  const newJob = new Job({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    next(error);
  }
};

export const getjobs = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const job = await Job.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { category: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalJobs = await Job.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthJobs = await Job.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      job,
      totalJobs,
      lastMonthJobs,
    });
  } catch (error) {
    next(error);
  }
};