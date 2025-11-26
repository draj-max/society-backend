import express from "express";

import uploadImage from "../middleware/upload";
import authenticate from "../middleware/authenticate";

import {
    getMemberComplaints,
    createComplaint, getComplaints,
    resolve_forward_Complaints
} from "../controllers/complainController";

import {
    complainSchema,
    complainQuerySchema,
    approveRejectComplainSchema,
} from "../validators/complain.validate";
import { validateBody, validateQuery } from "../middleware/validateBody";


const complainRouter = express.Router();

complainRouter.use(authenticate);
complainRouter.get(
    "/all-complaints",
    validateQuery(complainQuerySchema),
    getComplaints
);

complainRouter.post(
    "/create-complaint",
    uploadImage.single("complainProof"),
    validateBody(complainSchema),
    createComplaint
);

complainRouter.get(
    "/member-complaints",
    validateQuery(complainQuerySchema),
    getMemberComplaints
);

complainRouter.put(
    "/resolve-forward-complaint",
    validateBody(approveRejectComplainSchema),
    resolve_forward_Complaints
);

export default complainRouter;
