import express
from "express";

import {

  protect,

  authorize

} from "../../middlewares/auth.middleware.js";

import {

  getNotificationsController,

  markNotificationAsReadController,

  markAllNotificationsAsReadController

} from "./notification.controller.js";

const router =
express.Router();

/**
 * 🚀 GET NOTIFICATIONS
 */
router.get(

  "/",

  protect,

  authorize(

    "student",

    "institute",

    "super-admin"
  ),

  getNotificationsController
);

/**
 * 🚀 MARK SINGLE AS READ
 */
router.patch(

  "/:id/read",

  protect,

  authorize(

    "student",

    "institute",

    "super-admin"
  ),

  markNotificationAsReadController
);

/**
 * 🚀 MARK ALL AS READ
 */
router.patch(

  "/read-all",

  protect,

  authorize(

    "student",

    "institute",

    "super-admin"
  ),

  markAllNotificationsAsReadController
);

export default router;