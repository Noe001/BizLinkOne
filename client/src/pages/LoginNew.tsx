import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, AlertCircle, Mail, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Slack風: シンプルなログインフロー
export default function LoginPage() {
  const [location, setLocation] = useLocation();
  const { t } = useTranslation();
  const { signIn } = useAuth();
  
  // URLからemailを取得（サインアップから誘導された場合）
  const searchParams = new URLSearchParams(window.location.search);
  const emailParam = searchParams.get('email');
  
  const [email, setEmail] = useState(emailParam || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'email' | 'password'>(emailParam ? 'password' : 'email');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message || t('auth.login.error'));
      } else {
        // ログイン成功 → ダッシュボードへ
        setLocation('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t('auth.login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setPassword('');
    setError(null);
  };

  return (
    <div className="min-h-svh bg-background flex items-center justify-center px-4 py-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => step === 'password' ? handleBackToEmail() : setLocation('/')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
              <CardTitle className="text-2xl">
                <span className="text-green-800">{t('common.appName')}</span>
              </CardTitle>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {t('auth.login.title')}
              </p>
            </div>
            <div className="w-8" />
          </div>
          <CardDescription className="text-center">
            {step === 'email' ? t('auth.login.subtitle') : t('auth.login.welcomeBack', { email })}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.login.emailLabel')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.login.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" size="lg">
                {t('auth.login.continue')}
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
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
                    autoFocus
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
              
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? t('auth.login.signingIn') : t('auth.login.signIn')}
              </Button>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => setLocation('/reset-password')}
                  className="text-sm underline"
                >
                  {t('auth.login.forgotPassword')}
                </Button>
              </div>
            </form>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('auth.login.or')}
              </span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {t('auth.login.newTo', { appName: t('common.appName') })}
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setLocation('/signup')}
            >
              {t('auth.login.createAccount')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
