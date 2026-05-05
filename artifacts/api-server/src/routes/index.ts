import { Router, type IRouter } from "express";
import healthRouter from "./health";
import fabricshiftRouter from "./fabricshift";

const router: IRouter = Router();

router.use(healthRouter);
router.use(fabricshiftRouter);

export default router;
