import express from 'express';

import authenticate from '../middleware/authenticate';
import { validateBody, validateParams } from '../middleware/validateBody';

import {
    findUserIdSchema,
    updateUserSchema,
    updateMyProfileSchema,
    resetUserPasswordSchema,
} from '../validators/user.validate';

import {
    myProfile,
    updateUser,
    reactiveUser,
    deactiveUser,
    updateMyProfile,
    resetUserPassword,
} from '../controllers/userController';

const router = express.Router();

router.use(authenticate);
router.get('/me', myProfile);

router.put(
    '/update-profile',
    validateBody(updateMyProfileSchema),
    updateMyProfile,
);

router.put(
    '/deactive/:id',
    validateParams(findUserIdSchema),
    deactiveUser,
);

router.put(
    '/reactive/:id',
    validateParams(findUserIdSchema),
    reactiveUser,
);

router.put(
    '/update/:id',
    validateParams(findUserIdSchema),
    validateBody(updateUserSchema),
    updateUser,
);

router.put(
    '/reset-password',
    validateBody(resetUserPasswordSchema),
    resetUserPassword,
);

export default router;
