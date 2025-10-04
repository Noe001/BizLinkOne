import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Building2, Check, Plus, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  role: string;
}

export function WorkspaceSwitcher() {
  const [, setLocation] = useLocation();
  const { user, currentWorkspaceId, setCurrentWorkspaceId } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

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
    // ページをリロードしてデータを更新
    window.location.reload();
  };

  const handleCreateWorkspace = () => {
    setLocation('/workspace/create');
  };

  const handleWorkspaceSettings = () => {
    setLocation('/settings/workspace');
  };

  if (loading || !currentWorkspace) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/50">
        <Building2 className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start px-1 py-1 h-auto hover:bg-accent"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="h-6 w-6 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center flex-shrink-0">
              <Building2 className="h-3 w-3 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="text-xs font-semibold truncate max-w-[140px]">
                {currentWorkspace.name}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {currentWorkspace.role}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          ワークスペース
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            onClick={() => handleWorkspaceSwitch(workspace.id)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="h-6 w-6 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center flex-shrink-0">
              <Building2 className="h-3 w-3 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{workspace.name}</div>
              <div className="text-xs text-muted-foreground">{workspace.role}</div>
            </div>
            {workspace.id === currentWorkspaceId && (
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleCreateWorkspace}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>新しいワークスペースを作成</span>
        </DropdownMenuItem>
        
        {currentWorkspace && (
          <DropdownMenuItem
            onClick={handleWorkspaceSettings}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            <span>ワークスペース設定</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
