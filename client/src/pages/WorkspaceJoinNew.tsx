import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, AlertCircle, Users, CheckCircle2, Loader2 } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Slack風: 招待リンクから参加
export default function WorkspaceJoinPage() {
  const [location, setLocation] = useLocation();
  const { t } = useTranslation();
  const { joinWorkspaceByInvite, user } = useAuth();
  
  // URLから招待コードを取得
  const searchParams = new URLSearchParams(window.location.search);
  const inviteToken = searchParams.get('invite');
  
  const [inviteCode, setInviteCode] = useState(inviteToken || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workspaceInfo, setWorkspaceInfo] = useState<{
    name: string;
    memberCount: number;
    logo?: string;
  } | null>(null);

  // 招待コードがある場合、ワークスペース情報を取得
  useEffect(() => {
    if (inviteCode) {
      fetchWorkspaceInfo(inviteCode);
    }
  }, [inviteCode]);

  const fetchWorkspaceInfo = async (code: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // ワークスペース情報を取得（招待コードからワークスペース情報をプレビュー）
      const response = await fetch(`/api/workspaces/invite/${code}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setWorkspaceInfo(data.workspace);
      }
    } catch (err) {
      console.error('Fetch workspace info error:', err);
      setError(t('auth.workspaceJoin.invalidInvite'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!inviteCode) {
      setError(t('auth.workspaceJoin.enterInviteCode'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await joinWorkspaceByInvite(inviteCode);
      
      if (error) {
        setError(error.message || t('auth.workspaceJoin.error'));
      } else {
        // 参加成功 → ダッシュボードへ
        setLocation('/');
      }
    } catch (err) {
      console.error('Join workspace error:', err);
      setError(t('auth.workspaceJoin.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWorkspaceInfo(inviteCode);
  };

  // ログインしていない場合は、サインアップへリダイレクト（招待コード付き）
  if (!user) {
    setLocation(`/signup?invite=${encodeURIComponent(inviteCode)}`);
    return null;
  }

  return (
    <div className="min-h-svh bg-background flex items-center justify-center px-4 py-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/workspace/select')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
              <CardTitle className="text-2xl">
                <span className="text-green-800">{t('common.appName')}</span>
              </CardTitle>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {t('auth.workspaceJoin.title')}
              </p>
            </div>
            <div className="w-8" />
          </div>
          <CardDescription className="text-center">
            {t('auth.workspaceJoin.subtitle')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {workspaceInfo ? (
            // ワークスペース情報表示 + 参加ボタン
            <>
              <Card className="border-2 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      {workspaceInfo.logo ? (
                        <img src={workspaceInfo.logo} alt={workspaceInfo.name} className="h-12 w-12 rounded" />
                      ) : (
                        <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{workspaceInfo.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('auth.workspaceJoin.memberCount', { count: workspaceInfo.memberCount })}
                      </p>
                    </div>
                  </div>
                  <Alert className="bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      {t('auth.workspaceJoin.inviteValid')}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Button 
                onClick={handleJoin} 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('auth.workspaceJoin.joining')}
                  </>
                ) : (
                  t('auth.workspaceJoin.joinWorkspace')
                )}
              </Button>
            </>
          ) : (
            // 招待コード入力フォーム
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteCode">{t('auth.workspaceJoin.inviteCodeLabel')}</Label>
                <Input
                  id="inviteCode"
                  type="text"
                  placeholder={t('auth.workspaceJoin.inviteCodePlaceholder')}
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.trim())}
                  autoFocus
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {t('auth.workspaceJoin.inviteCodeHelp')}
                </p>
              </div>
              
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('auth.workspaceJoin.continue')
                )}
              </Button>
            </form>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('auth.workspaceJoin.or')}
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {t('auth.workspaceJoin.noInvite')}
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setLocation('/workspace/create')}
            >
              {t('auth.workspaceJoin.createNew')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
