import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Settings, LogOut, HelpCircle, Globe } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from '@/contexts/LanguageContext';
import type { SupportedLanguage } from '@/locales';

interface UserProfileDropdownProps {
  collapsed?: boolean;
  onLogout?: () => void;
}

const mockUser = {
  id: "current-user",
  name: "John Doe",
  email: "john.doe@company.com",
  avatar: "",
  role: "Admin",
  status: "online"
};

const LANGUAGE_OPTIONS: { value: SupportedLanguage; labelKey: string }[] = [
  { value: 'en', labelKey: 'language.english' },
  { value: 'ja', labelKey: 'language.japanese' },
];

export function UserProfileDropdown({ collapsed = false, onLogout }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={collapsed ? "p-2 h-auto w-auto transition-all duration-150 hover:scale-105" : "w-full justify-start p-2 h-auto hover:bg-accent px-3 transition-all duration-150"}
          data-testid="user-profile-dropdown"
        >
          {collapsed ? (
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 dark:bg-green-400 rounded-full border-2 border-background animate-pulse" />
            </div>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {mockUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 dark:bg-green-400 rounded-full border-2 border-background animate-pulse" />
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
              
              <Settings className="h-4 w-4 text-muted-foreground transition-transform duration-150 group-hover:rotate-90" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64" 
        align="end" 
        side="bottom"
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
          <Link href="/account-settings" className="flex items-center gap-3 cursor-pointer">
            <Settings className="h-4 w-4" />
            <span>{t('userMenu.accountSettings')}</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-3 cursor-pointer">
            <Globe className="h-4 w-4" />
            <span>{t('userMenu.language')}</span>
            <Badge variant="secondary" className="ml-auto text-xs">
              {t(`userMenu.languageTag.${language}`)}
            </Badge>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as SupportedLanguage)}>
              {LANGUAGE_OPTIONS.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/help" className="flex items-center gap-3 cursor-pointer">
            <HelpCircle className="h-4 w-4" />
            <span>{t('userMenu.helpSupport')}</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="flex items-center gap-3 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>{t('userMenu.signOut')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
