import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckSquare, Calendar, MessageSquare, BookOpen, X, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: "task" | "meeting" | "message" | "knowledge" | "reminder";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  sourceId?: string;
  sourceName?: string;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "task",
    title: "Task Due Soon",
    message: "Fix responsive design issues is due in 2 hours",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isRead: false,
    actionUrl: "/tasks",
    sourceId: "task-3",
    sourceName: "Mike Johnson",
  },
  {
    id: "notif-2",
    type: "meeting",
    title: "Meeting Starting",
    message: "Daily Standup starts in 30 minutes",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isRead: false,
    actionUrl: "/meetings",
    sourceId: "meeting-1",
  },
  {
    id: "notif-3",
    type: "message",
    title: "New Message",
    message: "John Doe mentioned you in #development",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
    actionUrl: "/chat/channel/development",
    sourceId: "msg-123",
    sourceName: "John Doe",
  },
  {
    id: "notif-4",
    type: "knowledge",
    title: "Knowledge Updated",
    message: "Authentication Setup Guide has been updated",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isRead: true,
    actionUrl: "/knowledge/kb-1",
    sourceId: "kb-1",
    sourceName: "Sarah Wilson",
  },
  {
    id: "notif-5",
    type: "reminder",
    title: "Task Reminder",
    message: "Don't forget to review the security requirements",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    isRead: true,
    actionUrl: "/tasks",
    sourceId: "task-2",
  },
];

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task": return <CheckSquare className="h-4 w-4" />;
      case "meeting": return <Calendar className="h-4 w-4" />;
      case "message": return <MessageSquare className="h-4 w-4" />;
      case "knowledge": return <BookOpen className="h-4 w-4" />;
      case "reminder": return <Clock className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "task": return "bg-blue-100 text-blue-800";
      case "meeting": return "bg-green-100 text-green-800";
      case "message": return "bg-purple-100 text-purple-800";
      case "knowledge": return "bg-orange-100 text-orange-800";
      case "reminder": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div 
        className="absolute right-4 top-16 w-96 max-h-[80vh] bg-background border rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        data-testid="notification-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={markAllAsRead}
                data-testid="mark-all-read"
              >
                Mark all read
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-96">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-accent transition-colors cursor-pointer ${
                  !notification.isRead ? 'bg-accent/50' : ''
                }`}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.actionUrl) {
                    window.location.href = notification.actionUrl;
                  }
                  onClose();
                }}
                data-testid={`notification-${notification.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatDistanceToNow(notification.timestamp, { addSuffix: true })}</span>
                          {notification.sourceName && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{notification.sourceName}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30">
          <Button variant="outline" className="w-full" size="sm">
            View All Notifications
          </Button>
        </div>
      </div>
    </div>
  );
}

// Notification Hook for managing notifications state
export function useNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      isRead: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    isOpen,
    setIsOpen,
    addNotification,
    unreadCount,
  };
}
