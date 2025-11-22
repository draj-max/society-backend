import { Router } from "express";

import authenticate from "../middleware/authenticate";
import { validateBody } from "../middleware/validateBody";

import { login, myProfile, register, refreshToken, logout } from "../controllers/authController";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validators/auth.validate";

const router = Router();

// unauthenticated / public routes 
router.post(
    '/login',
    validateBody(loginSchema),
    login
);

router.post(
    '/register',
    validateBody(registerSchema),
    register
);

router.post(
    '/refresh-token',
    validateBody(refreshTokenSchema),
    refreshToken
);

// authenticated / private routes
router.use(authenticate);

router.get('/me', myProfile);
router.post('/logout', logout);

export default router;
