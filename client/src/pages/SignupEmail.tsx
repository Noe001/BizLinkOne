import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, AlertCircle, Mail } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Slack風: メールアドレスのみでスタート
export default function SignupEmailPage() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { checkEmailExists } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // メールアドレスが既に登録されているかチェック
      const { exists, error: checkError } = await checkEmailExists(email);
      
      if (checkError) {
        setError(checkError.message || t('auth.signup.error'));
        setIsLoading(false);
        return;
      }

      if (exists) {
        // 既に登録済み → ログインページへ
        setLocation(`/login?email=${encodeURIComponent(email)}`);
      } else {
        // 未登録 → 確認コード送信ページへ
        setLocation(`/signup/verify?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      console.error('Email check error:', err);
      setError(t('auth.signup.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-background flex items-center justify-center px-4 py-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
              <CardTitle className="text-2xl">
                <span className="text-green-800">{t('common.appName')}</span>
              </CardTitle>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {t('auth.signupEmail.title')}
              </p>
            </div>
            <div className="w-8" />
          </div>
          <CardDescription className="text-center">
            {t('auth.signupEmail.subtitle')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleContinue} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.signupEmail.emailLabel')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.signupEmail.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  autoFocus
                  required
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('auth.signupEmail.emailHint')}
              </p>
            </div>
            
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? t('common.loading') : t('auth.signupEmail.continue')}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('auth.signupEmail.or')}
              </span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              {t('auth.signupEmail.haveAccount')}
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setLocation('/login')}
            >
              {t('auth.signupEmail.signIn')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
