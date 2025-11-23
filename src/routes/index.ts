import e from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import societyRoutes from "./societyRoutes";

const router = e.Router();

router.use("/auth", authRoutes);

router.use("/user", userRoutes);
router.use("/society", societyRoutes);

export default router;
