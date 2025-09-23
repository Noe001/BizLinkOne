import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar } from "@/components/AppSidebar";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import Projects from "@/pages/Projects";
import Tasks from "@/pages/Tasks";
import Knowledge from "@/pages/Knowledge";
import Meetings from "@/pages/Meetings";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Custom sidebar width for the workspace application
  const style = {
    "--sidebar-width": "20rem",       // 320px for better content organization
    "--sidebar-width-icon": "4rem",   // default icon width
  };

  const [location] = useLocation();

  const getHeaderTitle = (path: string) => {
    if (path === "/") return "Dashboard";
    if (path.startsWith("/chat")) return "Chat";
    if (path.startsWith("/projects")) return "Projects";
    if (path.startsWith("/tasks")) return "Tasks";
    if (path.startsWith("/knowledge")) return "Knowledge";
    if (path.startsWith("/meetings")) return "Meetings";
    if (path.startsWith("/settings")) return "Settings";
    return "Dashboard";
  };

  const headerTitle = getHeaderTitle(location || "/");

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1">
                  <header className="flex items-center justify-between p-2 border border-card-border bg-card rounded-lg m-2">
                    <div className="flex items-center min-w-0">
                      <a href="/" className="flex items-baseline ml-2">
                        <span className="text-lg uppercase font-sans ml-1 font-light text-green-800 truncate">{headerTitle}</span>
                      </a>
                    </div>
                    <div className="hidden lg:flex flex-row items-center gap-x-4 xl:gap-x-6">
                      <a href="#" className="text-sm uppercase font-mono font-medium text-foreground">Dashboard</a>
                      <a href="#" className="text-sm uppercase font-mono text-muted-foreground hover:text-foreground">Playground</a>
                      <a href="#" className="text-sm uppercase font-mono text-muted-foreground hover:text-foreground">Docs</a>
                      <a href="#" className="text-sm uppercase font-mono text-muted-foreground hover:text-foreground">Community</a>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="hidden sm:block">
                        <ThemeToggle />
                      </div>
                      <UserProfileDropdown collapsed={true} />
                    </div>
                  </header>
                <main className={`flex-1 overflow-auto bg-card rounded-lg m-2 ${!location.startsWith('/chat') ? 'border border-card-border' : ''}`}>
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
