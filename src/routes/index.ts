import e from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import billRoutes from "./billRoutes";
import societyRoutes from "./societyRoutes";
import complainRoutes from "./complainRoutes";

const router = e.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

router.use("/society", societyRoutes);
router.use("/bill", billRoutes);
router.use("/complain", complainRoutes);
export default router;
