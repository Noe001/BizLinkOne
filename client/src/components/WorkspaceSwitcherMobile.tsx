import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Building2, Check, Plus, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  role: string;
}

export function WorkspaceSwitcherMobile() {
  const [, setLocation] = useLocation();
  const { user, currentWorkspaceId, setCurrentWorkspaceId } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchWorkspaces = async () => {
      try {
        const response = await fetch(`/api/workspaces/user/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setWorkspaces(data);
          
          // 現在のワークスペースを設定
          if (currentWorkspaceId) {
            const current = data.find((w: Workspace) => w.id === currentWorkspaceId);
            setCurrentWorkspace(current || null);
          }
        }
      } catch (error) {
        console.error('Failed to fetch workspaces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [user, currentWorkspaceId]);

  const handleWorkspaceSwitch = (workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
    setOpen(false);
    window.location.reload();
  };

  const handleCreateWorkspace = () => {
    setOpen(false);
    setLocation('/workspace/create');
  };

  const handleWorkspaceSettings = () => {
    setOpen(false);
    setLocation('/settings/workspace');
  };

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Building2 className="h-4 w-4 mr-2" />
        <span className="text-sm">Loading...</span>
      </Button>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="justify-start gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="text-sm font-medium truncate max-w-[120px]">
                {currentWorkspace?.name || 'ワークスペース'}
              </span>
              {currentWorkspace && (
                <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                  {currentWorkspace.role}
                </Badge>
              )}
            </div>
            <ChevronDown className="h-4 w-4 flex-shrink-0 opacity-50" />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>ワークスペース</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-1">
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => handleWorkspaceSwitch(workspace.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left",
                  workspace.id === currentWorkspaceId && "bg-accent"
                )}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {workspace.name}
                    </span>
                    {workspace.id === currentWorkspaceId && (
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {workspace.role}
                  </Badge>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t pt-4 space-y-1">
            <button
              onClick={handleCreateWorkspace}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded bg-muted flex items-center justify-center">
                <Plus className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">
                新しいワークスペースを作成
              </span>
            </button>

            <button
              onClick={handleWorkspaceSettings}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded bg-muted flex items-center justify-center">
                <Settings className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium">
                ワークスペース設定
              </span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
