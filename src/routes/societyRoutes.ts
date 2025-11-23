import express from 'express';

import authenticate from '../middleware/authenticate';
import { validateBody, validateParams } from '../middleware/validateBody';

import {
    createSocietySchema,
    findSocietyIdSchema,
    updateSocietySchema
} from '../validators/society.validate';
import {
    createSociety,
    deleteSociety,
    getAllSocieties,
    getSocietyById,
    updateSociety
} from '../controllers/societyController';


const router = express.Router();

router.use(authenticate);
router.get("/all-societies", getAllSocieties);

router.get(
    "/society/:id",
    validateParams(findSocietyIdSchema),
    getSocietyById
);

router.post(
    "/create-society",
    validateBody(createSocietySchema),
    createSociety
);

router.put(
    "/update-society/:id",
    validateParams(findSocietyIdSchema),
    validateBody(updateSocietySchema),
    updateSociety
);

router.delete(
    "/delete-society/:id",
    validateParams(findSocietyIdSchema),
    deleteSociety
);


export default router;
