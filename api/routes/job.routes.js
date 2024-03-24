import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getjobs, deletejobs, updatejob } from '../controllers/job.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getjobs', getjobs)
router.put('/deletejobs/:jobId/:userId', verifyToken, deletejobs)
router.put('/updatejob/:jobId/:userId', verifyToken, updatejob)


export default router;
