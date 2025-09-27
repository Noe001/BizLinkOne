import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NotificationContent, useNotifications } from "@/components/NotificationPanel";
import { useTranslation } from "@/contexts/LanguageContext";
import { Bell } from "lucide-react";

export function HeaderBellDropdown() {
  const { t } = useTranslation();
  const { setIsOpen, notifications, unreadCount, setNotifications } = useNotifications();

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => (
      notification.id === id ? { ...notification, isRead: true } : notification
    )));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={t("header.notificationsAria")}
          className="relative border-0"
          data-testid="header-notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 min-w-[1rem] px-1 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="end" sideOffset={8} className="w-96 p-0">
        <NotificationContent
          notifications={notifications}
          unreadCount={unreadCount}
          markAllAsRead={markAllAsRead}
          markAsRead={markAsRead}
          deleteNotification={deleteNotification}
          onClose={() => setIsOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
