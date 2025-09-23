import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Settings, User, LogOut, HelpCircle, Moon, Sun, Bell, Shield, Palette, Globe } from "lucide-react";
import { Link } from "wouter";

interface UserProfileDropdownProps {
  collapsed?: boolean;
}

// Mock user data - replace with actual user context
const mockUser = {
  id: "current-user",
  name: "John Doe",
  email: "john.doe@company.com",
  avatar: "",
  role: "Admin",
  status: "online"
};

export function UserProfileDropdown({ collapsed = false }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={collapsed ? "p-2 h-auto w-auto" : "w-full justify-start p-2 h-auto hover:bg-accent px-3"}
          data-testid="user-profile-dropdown"
        >
          {collapsed ? (
            // Header mode - icon only
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {/* Online status indicator */}
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-background" />
            </div>
          ) : (
            // Sidebar mode - full layout
            <div className="flex items-center gap-3 w-full">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {mockUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {/* Online status indicator */}
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-background" />
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{mockUser.name}</span>
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    {mockUser.role}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{mockUser.email}</p>
              </div>
              
              <Settings className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64" 
        align="end" 
        side="right"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0">
          <div className="flex items-center gap-3 p-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {mockUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{mockUser.name}</span>
                <div className="h-2 w-2 bg-green-500 rounded-full" />
              </div>
              <p className="text-sm text-muted-foreground truncate">{mockUser.email}</p>
              <Badge variant="outline" className="text-xs mt-1">
                {mockUser.role}
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/settings/profile" className="flex items-center gap-3 cursor-pointer">
            <User className="h-4 w-4" />
            <span>View Profile</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center gap-3 cursor-pointer">
            <Settings className="h-4 w-4" />
            <span>Account Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/settings/appearance" className="flex items-center gap-3 cursor-pointer">
            <Palette className="h-4 w-4" />
            <span>Preferences</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/settings/notifications" className="flex items-center gap-3 cursor-pointer">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href="/settings/security" className="flex items-center gap-3 cursor-pointer">
            <Shield className="h-4 w-4" />
            <span>Security & Privacy</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="flex items-center gap-3 cursor-pointer">
          <Moon className="h-4 w-4" />
          <span>Dark Mode</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            Auto
          </Badge>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center gap-3 cursor-pointer">
          <Globe className="h-4 w-4" />
          <span>Language</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            EN
          </Badge>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/help" className="flex items-center gap-3 cursor-pointer">
            <HelpCircle className="h-4 w-4" />
            <span>Help & Support</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="flex items-center gap-3 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
