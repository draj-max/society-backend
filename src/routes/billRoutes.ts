import express from "express";

import {
    payBill,
    createBill,
    updateBill,
    getBillsByMemberId,
    getBillsBySocietyId,
} from "../controllers/billController";

import authenticate from "../middleware/authenticate";
import { validateBody, validateParams, validateQuery } from "../middleware/validateBody";
import { idSchema, createBillSchema, updateBillSchema, statusSchema } from "../validators/bill.validate";

const billRouter = express.Router();

billRouter.use(authenticate);
billRouter.post(
    "/create",
    validateBody(createBillSchema),
    createBill
);

billRouter.get(
    "/all-bills",
    getBillsBySocietyId
);

billRouter.get(
    "/member-bills",
    validateBody(idSchema),
    validateQuery(statusSchema),
    getBillsByMemberId
);

billRouter.put(
    "/update/:id",
    validateParams(idSchema),
    validateBody(updateBillSchema),
    updateBill
);

billRouter.put(
    "/pay",
    validateBody(idSchema),
    payBill
);

export default billRouter;

