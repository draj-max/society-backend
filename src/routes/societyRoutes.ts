import express from 'express';

import authenticate from '../middleware/authenticate';
import { validateBody, validateParams } from '../middleware/validateBody';

import {
    MemberIdSchema,
    addMemberSchema,
    createSocietySchema,
    findSocietyIdSchema,
    updateSocietySchema,
} from '../validators/society.validate';
import {
    updateSociety,
    createSociety,
    deleteSociety,
    getAllSocieties,
    getSocietyById,
    addMemberToSociety,
    removeMemberFromSociety,
    getAllMembersOfSociety,
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

router.post(
    "/add-member",
    validateBody(addMemberSchema),
    addMemberToSociety
);

router.post(
    "/remove-member",
    validateBody(MemberIdSchema),
    removeMemberFromSociety
);

router.get(
    "/members",
    getAllMembersOfSociety
);

export default router;
