import express
    from "express";

import {

    protect,

    authorize

} from "../../middlewares/auth.middleware.js";

import {

    startAttemptController

} from "./attempt.controller.js";
import { startAttemptSchema } from "./attempt.validation.js";
import { validate } from "../../middlewares/validate.js";

const router =
    express.Router();

// 🚀 START EXAM
router.post(

    "/start/:testId",

    protect,

    authorize("student"),

    validate(
        startAttemptSchema
    ),

    startAttemptController
);

export default router;