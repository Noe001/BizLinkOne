import { MessageSquare, CheckSquare, BookOpen, Calendar, Settings, Hash, User, Users, Home, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation, Link } from "wouter";

// todo: remove mock functionality
const mockChannels = [
  { id: "general", name: "general", unread: 3 },
  { id: "development", name: "development", unread: 0 },
  { id: "marketing", name: "marketing", unread: 1 },
  { id: "support", name: "support", unread: 0 },
];

const mockDirectMessages = [
  { id: "john", name: "John Doe", status: "online", unread: 2 },
  { id: "sarah", name: "Sarah Wilson", status: "away", unread: 0 },
  { id: "mike", name: "Mike Johnson", status: "offline", unread: 1 },
];

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Knowledge", url: "/knowledge", icon: BookOpen },
  { title: "Meetings", url: "/meetings", icon: Calendar },
];

export function AppSidebar() {
  const [location] = useLocation();
  
  const isActive = (url: string) => {
    if (url === "/") {
      return location === "/";
    }
    return location.startsWith(url);
  };
  
  const isActiveChannel = (channelId: string) => {
    return location === `/chat/channel/${channelId}`;
  };
  
  const isActiveDM = (dmId: string) => {
    return location === `/chat/dm/${dmId}`;
  };
  
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-md">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="font-semibold text-lg">WorkflowHub</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild data-testid={`nav-${item.title.toLowerCase()}`}>
                    <Link 
                      href={item.url} 
                      className="flex items-center py-0.5"
                      aria-current={isActive(item.url) ? "page" : undefined}
                      data-active={isActive(item.url)}
                    >
                      {isActive(item.url) && (
                        <div className="mr-3 h-2 w-2 rounded-full bg-orange-500" data-testid="selection-indicator"></div>
                      )}
                      <item.icon className={isActive(item.url) ? "" : "mr-3"} />
                      <span className="text-sm font-sans">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-primary">Channels</span>
            <Button size="icon" variant="ghost" className="h-4 w-4" data-testid="button-add-channel">
              <Plus className="h-3 w-3" />
            </Button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mockChannels.map((channel) => (
                <SidebarMenuItem key={channel.id}>
                  <SidebarMenuButton asChild data-testid={`channel-${channel.name}`}>
                    <Link 
                      href={`/chat/channel/${channel.id}`} 
                      className="flex items-center justify-between"
                      aria-current={isActiveChannel(channel.id) ? "page" : undefined}
                      data-active={isActiveChannel(channel.id)}
                    >
                      <div className="flex items-center gap-2">
                        {isActiveChannel(channel.id) && (
                          <div className="mr-1 h-2 w-2 rounded-full bg-orange-500" data-testid="selection-indicator"></div>
                        )}
                        <Hash className={isActiveChannel(channel.id) ? "w-4 h-4" : "w-4 h-4 ml-3"} />
                        <span>{channel.name}</span>
                      </div>
                      {channel.unread > 0 && (
                        <Badge variant="secondary" className="h-5 text-xs" data-testid={`unread-${channel.name}`}>
                          {channel.unread}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-primary">Direct Messages</span>
            <Button size="icon" variant="ghost" className="h-4 w-4" data-testid="button-add-dm">
              <Plus className="h-3 w-3" />
            </Button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mockDirectMessages.map((dm) => (
                <SidebarMenuItem key={dm.id}>
                  <SidebarMenuButton asChild data-testid={`dm-${dm.name}`}>
                    <Link 
                      href={`/chat/dm/${dm.id}`} 
                      className="flex items-center justify-between"
                      aria-current={isActiveDM(dm.id) ? "page" : undefined}
                      data-active={isActiveDM(dm.id)}
                    >
                      <div className="flex items-center gap-2">
                        {isActiveDM(dm.id) && (
                          <div className="mr-1 h-2 w-2 rounded-full bg-orange-500" data-testid="selection-indicator"></div>
                        )}
                        <div className={`relative ${isActiveDM(dm.id) ? '' : 'ml-3'}`}>
                          <Avatar className="w-4 h-4">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${dm.name}`} />
                            <AvatarFallback className="text-xs">
                              {dm.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background ${
                            dm.status === 'online' ? 'bg-status-online' : 
                            dm.status === 'away' ? 'bg-status-away' : 
                            'bg-status-offline'
                          }`} />
                        </div>
                        <span className="text-sm">{dm.name}</span>
                      </div>
                      {dm.unread > 0 && (
                        <Badge variant="secondary" className="h-5 text-xs" data-testid={`unread-${dm.name}`}>
                          {dm.unread}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild data-testid="nav-settings">
              <Link 
                href="/settings"
                aria-current={isActive('/settings') ? "page" : undefined}
                data-active={isActive('/settings')}
              >
                {isActive('/settings') && (
                  <div className="mr-3 h-2 w-2 rounded-full bg-orange-500" data-testid="selection-indicator"></div>
                )}
                <Settings className={isActive('/settings') ? "" : "mr-3"} />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}