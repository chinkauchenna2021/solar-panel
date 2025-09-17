import { prisma } from "../db/prisma.js";

// GET /notifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id; // ✅ middleware should set this from JWT
    const { page = 1, limit = 20, unread_only = false } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // ✅ Build filters
    const where = { userId };
    if (unread_only === "true") {
      where.isRead = false;
    }

    // ✅ Fetch notifications
    const [notifications, totalItems, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return res.json({
      success: true,
      data: {
        notifications: notifications.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type,
          icon: n.icon,
          isRead: n.isRead,
          createdAt: n.createdAt,
          actionUrl: n.actionUrl,
        })),
        unreadCount,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalItems / Number(limit)),
          totalItems,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
export { getNotifications };




// PUT /notifications/:notificationId/read
const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await prisma.notification.update({
      where: { id: Number(notificationId) },
      data: { isRead: true },
    });

    res.json({
      success: true,
      message: "Notification marked as read",
      data: null,
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    console.error("Error marking notification:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};



// PUT /notifications/mark-all-read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.userId; // ✅ middleware must set req.user

    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    res.json({
      success: true,
      message: "All notifications marked as read",
      data: { markedCount: result.count },
    });
  } catch (err) {
    console.error("Error marking all notifications:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

export { markNotificationAsRead, markAllNotificationsAsRead };
