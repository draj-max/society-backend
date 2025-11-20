import { Router } from "express";

import authenticate from "../middleware/authenticate";
import { validate } from "../middleware/validateBody";

import { login, myProfile, register } from "../controllers/authController";
import { registerSchema, loginSchema } from "../validators/auth.validate";

const router = Router();

// unauthenticated / public routes 
router.post(
    '/login',
    validate({ body: loginSchema }),
    login
);

router.post(
    '/register',
    validate({ body: registerSchema }),
    register
);

// authenticated / private routes
router.use(authenticate);

router.get('/profile', myProfile);

export default router;
