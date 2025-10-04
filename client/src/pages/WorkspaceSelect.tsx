import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, Plus, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface UserWorkspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  role: string;
  memberCount: number;
}

// Slack風: ワークスペース作成 or 参加を選択 (既存ワークスペース表示機能付き)
export default function WorkspaceSelectPage() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { user, setCurrentWorkspaceId } = useAuth();
  const [workspaces, setWorkspaces] = useState<UserWorkspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLocation('/signup');
      return;
    }

    // ユーザーのワークスペース一覧を取得
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch(`/api/workspaces/user/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setWorkspaces(data);
          
          // ワークスペースが1つだけある場合は自動的に選択してダッシュボードへ
          if (data.length === 1) {
            setCurrentWorkspaceId(data[0].id);
            setLocation('/');
            return;
          }
        }
      } catch (error) {
        console.error('Failed to fetch workspaces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [user, setLocation, setCurrentWorkspaceId]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-svh bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto" />
          <p className="mt-4 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const handleWorkspaceSelect = (workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
    setLocation('/');
  };

  return (
    <div className="min-h-svh bg-background flex items-center justify-center px-4 py-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">
            <span className="text-green-800">{t('common.appName')}</span>
          </CardTitle>
          <p className="text-2xl font-semibold text-foreground mt-4">
            {t('auth.workspaceSelect.welcome', { name: user.name })}
          </p>
          <CardDescription className="text-base">
            {workspaces.length > 0 
              ? 'ワークスペースを選択するか、新しいワークスペースを作成してください'
              : t('auth.workspaceSelect.subtitle')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* 既存のワークスペース一覧 */}
          {workspaces.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                あなたのワークスペース
              </h3>
              {workspaces.map((workspace) => (
                <Card 
                  key={workspace.id}
                  className="border-2 hover:border-green-600 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => handleWorkspaceSelect(workspace.id)}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate group-hover:text-green-600 transition-colors">
                          {workspace.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {workspace.memberCount}人のメンバー • {workspace.role}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-green-600 transition-colors flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="pt-2 pb-2">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      または
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 新しいワークスペースを作成 */}
          <Card 
            className="border-2 hover:border-green-600 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => setLocation('/workspace/create')}
          >
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-colors">
                  <Plus className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-green-600 transition-colors">
                    {t('auth.workspaceSelect.createNew')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('auth.workspaceSelect.createDescription')}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-green-600 transition-colors flex-shrink-0 mt-1" />
              </div>
            </CardContent>
          </Card>

          {/* 既存のワークスペースに参加 */}
          <Card 
            className="border-2 hover:border-green-600 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => setLocation('/workspace/join')}
          >
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                    {t('auth.workspaceSelect.joinExisting')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('auth.workspaceSelect.joinDescription')}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
              </div>
            </CardContent>
          </Card>

          <div className="pt-4">
            <p className="text-xs text-center text-muted-foreground">
              {t('auth.workspaceSelect.hint')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
