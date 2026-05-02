import mongoose
    from "mongoose";

import Notification
    from "./notification.model.js";

import {

    getIO,

    getUserSocket

} from "../../config/socket.config.js";

import {
    AppError
} from "../../shared/utils/AppError.js";

interface CreateNotificationInput {

    userId: string;

    title: string;

    message: string;

    type?:
    | "exam"
    | "result"
    | "system"
    | "security";

    link?: string;
}

/**
 * 🚀 CREATE NOTIFICATION
 */
export const createNotification =
    async (

        data:
            CreateNotificationInput
    ) => {

        // ✅ VALIDATE USER ID
        if (
            !mongoose.Types.ObjectId.isValid(
                data.userId
            )
        ) {

            throw new AppError(
                "Invalid user ID",
                400
            );
        }

        // ✅ SAVE IN DATABASE
        const notification =
            await Notification.create({

                userId:
                    data.userId,

                title:
                    data.title,

                message:
                    data.message,

                type:
                    data.type || "system",

                link:
                    data.link,
            });

        // 🚀 REALTIME SOCKET EMIT
        try {

            const socketId =
                getUserSocket(
                    data.userId
                );

            // ✅ USER ONLINE
            if (socketId) {

                const io = getIO();

                io.to(socketId).emit(

                    "new_notification",

                    notification
                );
            }

        } catch (error) {

            console.error(

                "Socket emit failed:",

                error
            );
        }

        return notification;
    };

/**
 * 🚀 GET USER NOTIFICATIONS
 */
export const getUserNotifications =
    async (

        userId: string,

        page = 1,

        limit = 10
    ) => {

        const skip =
            (page - 1) * limit;

        // ✅ FETCH NOTIFICATIONS
        const notifications =
            await Notification.find({

                userId,
            })

                .sort({
                    createdAt: -1,
                })

                .skip(skip)

                .limit(limit)

                .lean();

        // ✅ TOTAL COUNT
        const total =
            await Notification.countDocuments({

                userId,
            });

        // ✅ UNREAD COUNT
        const unreadCount =
            await Notification.countDocuments({

                userId,

                isRead: false,
            });

        return {

            notifications,

            unreadCount,

            pagination: {

                total,

                page,

                limit,

                pages:
                    Math.ceil(
                        total / limit
                    ),
            },
        };
    };

/**
* 🚀 MARK ONE NOTIFICATION AS READ
*/
export const markNotificationAsRead =
    async (

        notificationId: string,

        userId: string
    ) => {

        const notification =
            await Notification.findOneAndUpdate(

                {

                    _id:
                        notificationId,

                    userId,
                },

                {

                    isRead: true,
                },

                {

                    new: true,
                }
            );

        if (!notification) {

            throw new AppError(

                "Notification not found",

                404
            );
        }

        return notification;
    };

/**
 * 🚀 MARK ALL AS READ
 */
export const markAllNotificationsAsRead =
    async (
        userId: string
    ) => {

        await Notification.updateMany(

            {

                userId,

                isRead: false,
            },

            {

                isRead: true,
            }
        );

        return {
            success: true,
        };
    };