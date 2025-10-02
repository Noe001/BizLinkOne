import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppSidebar } from "@/components/AppSidebar";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { NotificationsProvider } from "@/components/NotificationPanel";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { WorkspaceDataProvider } from "@/contexts/WorkspaceDataContext";
import { LanguageProvider, useTranslation } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import Projects from "@/pages/Projects";
import Tasks from "@/pages/Tasks";
import Knowledge from "@/pages/Knowledge";
import Meetings from "@/pages/Meetings";
import Settings from "@/pages/Settings";
import AccountSettings from "@/pages/AccountSettings";
import LoginPage from "@/pages/Login";
import SignupPage from "@/pages/Signup";
import WorkspaceCreatePage from "@/pages/WorkspaceCreate";
import WorkspaceJoinPage from "@/pages/WorkspaceJoin";
import NotFound from "@/pages/not-found";
import { HeaderBellDropdown } from "@/components/HeaderBellDropdown";

function AuthenticatedRouter() {
  return (
    <Switch>
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
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = () => {
    // モックユーザーデータでログイン
    login({
      id: "user-1",
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Admin"
    });
    setLocation("/");
  };

  const handleSignup = () => {
    // サインアップ後、ワークスペース作成画面に移行
    setLocation("/workspace/create");
  };

  const handleWorkspaceCreate = () => {
    // ワークスペース作成後、ログイン処理
    login({
      id: "user-1",
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Admin"
    });
    setLocation("/");
  };

  const handleWorkspaceJoin = () => {
    // ワークスペース参加後、ログイン処理
    login({
      id: "user-1",
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Member"
    });
    setLocation("/");
  };

  return (
    <Switch>
      <Route path="/login" component={() => <LoginPage onLogin={handleLogin} />} />
      <Route path="/signup" component={() => <SignupPage onSignup={handleSignup} />} />
      <Route path="/workspace/create" component={() => <WorkspaceCreatePage onWorkspaceCreate={handleWorkspaceCreate} />} />
      <Route path="/workspace/join" component={() => <WorkspaceJoinPage onWorkspaceJoin={handleWorkspaceJoin} />} />
      {/* 認証されていない場合は /login にリダイレクト */}
      <Route component={() => { setLocation("/login"); return null; }} />
    </Switch>
  );
}

function AuthenticatedApp() {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  
  const { t } = useTranslation();
  
  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  // Custom sidebar width for the workspace application
  const style = {
    "--sidebar-width": "20rem",       // 320px for better content organization
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  const [location] = useLocation();

  const getHeaderTitle = (path: string) => {
    if (path === "/") return t('nav.dashboard');
    if (path.startsWith("/chat")) return t('nav.chat');
    if (path.startsWith("/projects")) return t('nav.projects');
    if (path.startsWith("/tasks")) return t('nav.tasks');
    if (path.startsWith("/knowledge")) return t('nav.knowledge');
    if (path.startsWith("/meetings")) return t('nav.meetings');
    if (path.startsWith("/account-settings")) return t('nav.accountSettings'); // Updated for account settings
    if (path === "/settings" || path.startsWith("/settings/")) return t('nav.workspaceSettings'); // Updated for workspace settings
    if (path.startsWith("/workspace/create")) return t('nav.createWorkspace'); // Updated for create workspace
    if (path.startsWith("/workspace/join")) return t('nav.joinWorkspace'); // Updated for join workspace
    return t('nav.dashboard');
  };

  const headerTitle = getHeaderTitle(location || "/");

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex min-h-svh w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex flex-wrap items-center justify-between gap-3 p-2 border border-card-border bg-card rounded-lg m-2">
            <div className="flex items-center min-w-0 flex-1 sm:flex-none">
              <a href="/" className="flex items-baseline ml-2">
                <span className="text-lg uppercase font-sans ml-1 font-light text-green-800 truncate">{headerTitle}</span>
              </a>
            </div>
            {/* search moved to header right near theme toggle */}
            <div className="page-actions flex-1 sm:flex-none sm:justify-end">
              <div className="hidden sm:flex items-center mr-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input className="pl-10 w-60 rounded-md" placeholder={t('common.searchPlaceholder')} aria-label={t('header.searchLabel')} />
                </div>
              </div>
              <HeaderBellDropdown />
              <UserProfileDropdown collapsed={true} onLogout={handleLogout} />
            </div>
          </header>
          <main className={`flex-1 overflow-auto bg-card rounded-lg m-2 ${!location.startsWith('/chat') ? 'border border-card-border' : ''}`}>
            <AuthenticatedRouter />
          </main>
        </div>
      </div>
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
