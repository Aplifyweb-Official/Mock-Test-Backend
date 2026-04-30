import express
    from "express";

import {
    protect,
    authorize,
} from "../../middlewares/auth.middleware.js";

import {
    createTestController,
    getTestsController,
    getSingleTestController,
    updateTestController,
    deleteTestController,
} from "./test.controller.js";

import { validate }
    from "../../middlewares/validate.js";

import {
    createTestSchema,
    updateTestSchema,
} from "./test.validation.js";

const router =
    express.Router();

// CREATE TEST
router.post(
    "/",

    protect,

    authorize("institute"),

    validate(createTestSchema),

    createTestController
);

// GET ALL TESTS
router.get(
    "/",

    protect,

    authorize("institute"),

    getTestsController
);

// GET SINGLE TEST
router.get(
    "/:id",

    protect,

    authorize("institute"),

    getSingleTestController
);

// UPDATE TEST
router.patch(
    "/:id",

    protect,

    authorize("institute"),

    validate(updateTestSchema),

    updateTestController
);
// DELETE TEST
router.delete(
    "/:id",

    protect,

    authorize("institute"),

    deleteTestController
);

export default router;