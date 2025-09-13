import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../AppSidebar";

export default function AppSidebarExample() {
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-xl font-semibold">Main Content Area</h1>
          <p className="text-muted-foreground mt-2">
            This is where the main content would appear alongside the sidebar.
          </p>
        </main>
      </div>
    </SidebarProvider>
  );
}