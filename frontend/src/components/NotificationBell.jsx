import { useEffect, useState } from "react";
import api from "../api/axios";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      // silent fail — notifications are non-critical UI
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // poll every 15s
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      fetchNotifications();
    } catch (err) {
      // ignore
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button className="bell-btn" onClick={() => setOpen(!open)}>
        🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <strong>Notifications</strong>
            <button onClick={handleMarkAllRead}>Mark all read</button>
          </div>
          {notifications.length === 0 && <p style={{ padding: 10 }}>No notifications yet.</p>}
          {notifications.map((n) => (
            <div key={n._id} className={n.isRead ? "notification-item" : "notification-item unread"}>
              <p>{n.message}</p>
              <small>{new Date(n.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;