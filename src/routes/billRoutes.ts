import express from "express";

import uploadImage from "../middleware/upload";
import authenticate from "../middleware/authenticate";

import {
    payBill,
    createBill,
    updateBill,
    getBillsByMemberId,
    getBillsBySocietyId,
    approve_reject_BillPayment,
} from "../controllers/billController";

import {
    validateBody,
    validateParams,
    validateQuery
} from "../middleware/validateBody";

import {
    idSchema,
    createBillSchema,
    updateBillSchema,
    memberBillsQuerySchema,
    approveRejectBillSchema
} from "../validators/bill.validate";

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
    validateQuery(memberBillsQuerySchema),
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
    uploadImage.single("proofImage"),
    validateBody(idSchema),
    payBill
);

billRouter.put(
    "/approve-reject",
    validateBody(approveRejectBillSchema),
    approve_reject_BillPayment
);

export default billRouter;

