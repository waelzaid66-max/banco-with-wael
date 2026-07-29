import { Router } from "express";
import {
  createImportOrderHandler,
  listMyImportOrdersHandler,
  getImportOrderHandler,
  updateImportOrderStageHandler,
  cancelImportOrderHandler,
} from "../../controllers/importOrderController";
import { requireAuth, requireAdminRole } from "../../middlewares/authGuard";
import {
  publicRateLimiter,
  writeRateLimiter,
} from "../../middlewares/rateLimiter";

const router = Router();

router.post("/", writeRateLimiter, requireAuth, createImportOrderHandler);
// "/mine" must be registered before "/:id" so it is not captured as an id.
router.get("/mine", publicRateLimiter, requireAuth, listMyImportOrdersHandler);
router.get("/:id", publicRateLimiter, requireAuth, getImportOrderHandler);
router.patch("/:id/stage", writeRateLimiter, requireAuth, requireAdminRole, updateImportOrderStageHandler);
router.post("/:id/cancel", writeRateLimiter, requireAuth, cancelImportOrderHandler);

export default router;
