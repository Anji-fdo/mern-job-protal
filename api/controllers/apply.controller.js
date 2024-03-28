import Apply from '../models/apply.model.js';
import { errorHandler } from '../utils/error.js';
import mongoose from 'mongoose';

export const createApply = async (req, res, next) => {
 
  if (!req.body.fullName || !req.body.email || !req.body.telNo || !req.body.city || !req.body.address) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  
  try {
    const slug = req.body.fullName
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '-') // Replace special characters with '-'
      .replace(/-{2,}/g, '-') // Replace multiple consecutive '-' with single '-'
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing '-'

    const newApply = new Apply({
      ...req.body,
      slug,
      userId: req.user.id,
    });

    const savedApply = await newApply.save();
    res.status(201).json(savedApply);
  } catch (error) {
    next(error);
  }
};