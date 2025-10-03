import { useTranslation } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { BookOpen, Calendar, CheckSquare, FolderOpen, Home, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link, useLocation } from "wouter";

type MobileNavItem = {
  key: string;
  href: string;
  icon: LucideIcon;
  isActive: (path: string) => boolean;
};

const mobileNavItems: MobileNavItem[] = [
  {
    key: "nav.dashboard",
    href: "/",
    icon: Home,
    isActive: (path) => path === "/",
  },
  {
    key: "nav.chat",
    href: "/chat/channel/general",
    icon: MessageSquare,
    isActive: (path) => path.startsWith("/chat"),
  },
  {
    key: "nav.projects",
    href: "/projects",
    icon: FolderOpen,
    isActive: (path) => path.startsWith("/projects"),
  },
  {
    key: "nav.tasks",
    href: "/tasks",
    icon: CheckSquare,
    isActive: (path) => path.startsWith("/tasks"),
  },
  {
    key: "nav.knowledge",
    href: "/knowledge",
    icon: BookOpen,
    isActive: (path) => path.startsWith("/knowledge"),
  },
  {
    key: "nav.meetings",
    href: "/meetings",
    icon: Calendar,
    isActive: (path) => path.startsWith("/meetings"),
  },
];

export function MobileNav() {
  const isMobile = useIsMobile();
  const [location] = useLocation();
  const { t } = useTranslation();

  if (!isMobile) {
    return null;
  }

  const currentLocation = location ?? "/";

  return (
    <nav
      className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-card-border bg-card/95 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] supports-[backdrop-filter]:bg-card/80 backdrop-blur mobile-p-safe"
    >
      <ul className="grid grid-cols-6 text-xs">
        {mobileNavItems.map((item) => {
          const isActive = item.isActive(currentLocation);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive}
                className={cn(
                  "mobile-touch-target flex h-full flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-medium text-muted-foreground transition-all",
                  "data-[active=true]:text-green-800 data-[active=true]:font-semibold"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-transparent transition-all",
                    isActive && "border-green-200/80 bg-green-50/90"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-green-700" : "text-muted-foreground"
                    )}
                  />
                </span>
                <span className="truncate" data-testid={`mobile-nav-${item.key}`}>
                  {t(item.key)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
