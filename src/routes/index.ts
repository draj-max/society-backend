import e from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import societyRoutes from "./societyRoutes";
import billRoutes from "./billRoutes";

const router = e.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);

router.use("/society", societyRoutes);
router.use("/bill", billRoutes);
export default router;
