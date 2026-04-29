import express from "express";

import {
    protect,
    authorize,
} from "../../middlewares/auth.middleware.js";
import { getMyInstitute, updateInstitute } from "./institute.controller.js";



const router = express.Router();

router.get(
    "/me",
    protect,
    authorize("institute"),
    getMyInstitute
);

router.patch(
    "/me",
    protect,
    authorize("institute"),
    updateInstitute
);
export default router;