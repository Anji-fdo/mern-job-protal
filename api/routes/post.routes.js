import express from 'express';
import { verifyToken } from '../utils/veriyUser.js';
import { create, getpost, deletepost } from '../controllers/post.controller.js';


const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getposts', getpost)
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)


export default router;