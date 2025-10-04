import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginPageProps {
  onLogin?: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message || t('auth.login.error'));
      } else {
        // ログイン成功
        if (onLogin) onLogin();
        setLocation('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t('auth.login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert(t('auth.login.passwordResetNotice'));
  };

  return (
    <div className="min-h-svh bg-background flex items-center justify-center px-4 py-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            <span className="text-green-800">{t('common.appName')}</span>
          </CardTitle>
          <p className="text-lg font-semibold text-center text-foreground">
            {t('auth.login.title')}
          </p>
          <CardDescription className="text-center">
            {t('auth.login.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.login.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.login.passwordLabel')}</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('auth.login.signingIn') : t('auth.login.signIn')}
            </Button>
          </form>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              className="text-sm text-muted-foreground"
              onClick={handleForgotPassword}
            >
              {t('auth.login.forgotPassword')}
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setLocation('/signup')}
            >
              {t('auth.login.createAccount')}
            </Button>
            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={() => setLocation('/workspace/join')}
            >
              {t('auth.login.joinWorkspace')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
