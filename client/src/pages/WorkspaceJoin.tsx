import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Mail } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

interface WorkspaceJoinPageProps {
  onWorkspaceJoin: () => void;
}

export default function WorkspaceJoinPage({ onWorkspaceJoin }: WorkspaceJoinPageProps) {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [inviteCode, setInviteCode] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onWorkspaceJoin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/login')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center space-y-1">
              <CardTitle className="text-2xl">
                <span className="text-green-800">{t('common.appName')}</span>
              </CardTitle>
              <p className="text-lg font-semibold text-foreground">
                {t('auth.workspaceJoin.title')}
              </p>
            </div>
            <div className="w-8" />
          </div>
          <CardDescription className="text-center">
            {t('auth.workspaceJoin.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleJoinWorkspace} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteCode">{t('auth.workspaceJoin.inviteCodeLabel')}</Label>
              <Input
                id="inviteCode"
                type="text"
                placeholder={t('auth.workspaceJoin.inviteCodePlaceholder')}
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                {t('auth.workspaceJoin.inviteCodeHelp')}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.workspaceJoin.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                {t('auth.workspaceJoin.emailHelp')}
              </p>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('auth.workspaceJoin.joiningWorkspace') : t('auth.workspaceJoin.joinWorkspace')}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-5 w-5 text-green-800" />
                <h3 className="font-medium">{t('auth.workspaceJoin.teamWorkspaceTitle')}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {t('auth.workspaceJoin.teamWorkspaceDescription')}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span>{t('auth.workspaceJoin.inviteSentNotice')}</span>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {t('auth.workspaceJoin.missingInvite')}
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setLocation('/workspace/create')}
              >
                {t('auth.workspaceJoin.createNewWorkspace')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
