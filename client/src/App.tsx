import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppSidebar } from "@/components/AppSidebar";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { WorkspaceSwitcher } from "@/components/WorkspaceSwitcher";
import { WorkspaceSwitcherMobile } from "@/components/WorkspaceSwitcherMobile";
import { NotificationsProvider } from "@/components/NotificationPanel";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { WorkspaceDataProvider } from "@/contexts/WorkspaceDataContext";
import { LanguageProvider, useTranslation } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import Projects from "@/pages/Projects";
import Tasks from "@/pages/Tasks";
import Knowledge from "@/pages/Knowledge";
import Meetings from "@/pages/Meetings";
import Settings from "@/pages/Settings";
import AccountSettings from "@/pages/AccountSettings";
import LoginPage from "@/pages/LoginNew";
import SignupPage from "@/pages/SignupEmail";
import SignupComplete from "@/pages/SignupComplete";
import LandingPage from "@/pages/Landing";
import VerifyEmailPage from "@/pages/VerifyEmail";
import WorkspaceSelectPage from "@/pages/WorkspaceSelect";
import WorkspaceCreatePage from "@/pages/WorkspaceCreate";
import WorkspaceJoinPage from "@/pages/WorkspaceJoinNew";
import WorkspaceSettingsPage from "@/pages/WorkspaceSettings";
import NotFound from "@/pages/not-found";
import { HeaderBellDropdown } from "@/components/HeaderBellDropdown";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/MobileNav";

function AuthenticatedRouter() {
  const [location, setLocation] = useLocation();

  const handleWorkspaceCreate = () => {
    // ワークスペース作成後、ダッシュボードにリダイレクト
    setLocation("/");
  };

  return (
    <Switch>
      <Route path="/workspace/select" component={WorkspaceSelectPage} />
      <Route path="/workspace/create" component={() => <WorkspaceCreatePage onWorkspaceCreate={handleWorkspaceCreate} />} />
      <Route path="/settings/workspace" component={WorkspaceSettingsPage} />
      <Route path="/" component={Dashboard} />
      <Route path="/chat/:type/:id" component={Chat} />
      <Route path="/projects" component={Projects} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/knowledge" component={Knowledge} />
      <Route path="/meetings" component={Meetings} />
      <Route path="/settings" component={Settings} />
      <Route path="/settings/:tab" component={Settings} />
      <Route path="/account-settings" component={AccountSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function UnauthenticatedRouter() {
  const [location, setLocation] = useLocation();

  // URLからemailとinviteパラメータを取得
  const searchParams = new URLSearchParams(window.location.search);
  const emailParam = searchParams.get('email');
  const inviteParam = searchParams.get('invite');

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={() => <LoginPage />} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/signup/verify" component={() => <VerifyEmailPage email={emailParam || undefined} />} />
      <Route path="/signup/complete" component={SignupComplete} />
      <Route path="/workspace/join" component={WorkspaceJoinPage} />
      {/* 旧互換性用（verify-emailは新しいフローではsignup/verifyを使用） */}
      <Route path="/verify-email" component={() => <VerifyEmailPage email={emailParam || undefined} />} />
      <Route component={() => { setLocation("/"); return null; }} />
    </Switch>
  );
}

function AuthenticatedApp() {
  const { logout } = useAuth();
  const [location, setLocation] = useLocation();

  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isMobile && mobileSearchOpen) {
      setMobileSearchOpen(false);
    }
  }, [isMobile, mobileSearchOpen]);

  useEffect(() => {
    if (!mobileSearchOpen) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const timer = window.setTimeout(() => {
      mobileSearchInputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [mobileSearchOpen]);

  useEffect(() => {
    setMobileSearchOpen(false);
  }, [location]);

  const currentLocation = location ?? "/";

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const sidebarStyle = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  } as unknown as CSSProperties;

  const getHeaderTitle = (path: string) => {
    if (path === "/") return t('nav.dashboard');
    if (path.startsWith("/chat")) return t('nav.chat');
    if (path.startsWith("/projects")) return t('nav.projects');
    if (path.startsWith("/tasks")) return t('nav.tasks');
    if (path.startsWith("/knowledge")) return t('nav.knowledge');
    if (path.startsWith("/meetings")) return t('nav.meetings');
    if (path.startsWith("/account-settings")) return t('nav.accountSettings');
    if (path === "/settings" || path.startsWith("/settings/")) return t('nav.workspaceSettings');
    if (path.startsWith("/workspace/create")) return t('nav.createWorkspace');
    if (path.startsWith("/workspace/join")) return t('nav.joinWorkspace');
    return t('nav.dashboard');
  };

  const headerTitle = getHeaderTitle(currentLocation);
  const showMainBorder = !currentLocation.startsWith('/chat');


  const headerClassName = cn(
    "flex items-center justify-between gap-2 sm:gap-3 p-2 border border-card-border bg-card rounded-lg m-2",
    isMobile && "sticky top-0 z-40 m-0 rounded-none border-x-0 border-t-0 shadow-sm supports-[backdrop-filter]:bg-card/80 backdrop-blur"
  );

  const mainClassName = cn(
    "flex-1 overflow-auto bg-card rounded-lg mr-2 ml-2",
    showMainBorder && "border border-card-border",
    isMobile && "m-0 rounded-none shadow-none pt-4 pb-[calc(5.75rem+env(safe-area-inset-bottom,0px))]",
  );

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex min-h-svh w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className={headerClassName}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {isMobile && (
                <>
                  <SidebarTrigger
                    className="!h-10 !w-10 shrink-0 rounded-lg border border-card-border/80 bg-card/60 text-muted-foreground shadow-none"
                  />
                  <WorkspaceSwitcherMobile />
                </>
              )}
              <a href="/" className="flex min-w-0 flex-col justify-center">
                <span className="text-base sm:text-lg uppercase font-sans font-light text-green-800 truncate">
                  {headerTitle}
                </span>
              </a>
            </div>
            <div className={cn(
              "flex items-center gap-1 sm:gap-2",
              !isMobile && "page-actions flex-1 sm:flex-none sm:justify-end"
            )}>
              {isMobile ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full border border-card-border bg-card/40 text-muted-foreground"
                  onClick={() => setMobileSearchOpen(true)}
                  aria-label={t('header.searchLabel')}
                  data-testid="header-search-mobile"
                >
                  <Search className="h-5 w-5" />
                </Button>
              ) : (
                <div className="hidden sm:flex items-center mr-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input className="pl-10 w-60 rounded-md" placeholder={t('common.searchPlaceholder')} aria-label={t('header.searchLabel')} />
                  </div>
                </div>
              )}
              <HeaderBellDropdown />
              <UserProfileDropdown collapsed={true} onLogout={handleLogout} />
            </div>
          </header>
          <main className={mainClassName}>
            <AuthenticatedRouter />
          </main>
          <MobileNav />
        </div>
      </div>

      <Sheet open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
        <SheetContent
          side="top"
          className="md:hidden border-b border-card-border bg-card/95 pt-[max(env(safe-area-inset-top,0px),0.75rem)] pb-6 supports-[backdrop-filter]:bg-card/80 backdrop-blur"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{t('common.searchPlaceholder')}</SheetTitle>
          </SheetHeader>
          <form
            className="mt-2"
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                ref={mobileSearchInputRef}
                className="h-12 rounded-full pl-12 text-base"
                placeholder={t('common.searchPlaceholder')}
                aria-label={t('header.searchLabel')}
              />
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </SidebarProvider>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <UnauthenticatedRouter />;
  }

  return (
    <NotificationsProvider>
      <AuthenticatedApp />
    </NotificationsProvider>
  );
}

function AppRoot() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <LanguageProvider>
            <AuthProvider>
              <WorkspaceDataProvider>
                <App />
                <Toaster />
              </WorkspaceDataProvider>
            </AuthProvider>
          </LanguageProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Notification header removed per request

export default AppRoot;
