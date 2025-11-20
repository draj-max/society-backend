import express from 'express';
import authenticate from '../middleware/authenticate';
import { getAllUsers } from '../controllers/userController';

const router = express.Router();

router.use(authenticate);
router.get('/all-users', getAllUsers);

export default router;
