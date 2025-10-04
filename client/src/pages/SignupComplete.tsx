import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Slack風: 確認コード検証後に名前とパスワード設定
export default function SignupCompletePage() {
  const [location, setLocation] = useLocation();
  const { t } = useTranslation();
  const { completeSignup } = useAuth();
  
  // URLからemailを取得
  const searchParams = new URLSearchParams(window.location.search);
  const email = searchParams.get('email');
  
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // メールアドレスがない場合はサインアップページにリダイレクト
  useEffect(() => {
    if (!email) {
      setLocation('/signup');
    }
  }, [email, setLocation]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) return;

    if (formData.password.length < 8) {
      setError(t('auth.signupComplete.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await completeSignup(email, formData.name, formData.password);
      
      if (error) {
        setError(error.message || t('auth.signupComplete.error'));
      } else {
        // サインアップ完了 → ワークスペース選択ページへ
        setLocation('/workspace/select');
      }
    } catch (err) {
      console.error('Signup complete error:', err);
      setError(t('auth.signupComplete.error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
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
              onClick={() => setLocation(`/signup/verify?email=${encodeURIComponent(email)}`)}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
              <CardTitle className="text-2xl">
                <span className="text-green-800">{t('common.appName')}</span>
              </CardTitle>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {t('auth.signupComplete.title')}
              </p>
            </div>
            <div className="w-8" />
          </div>
          <CardDescription className="text-center">
            {t('auth.signupComplete.subtitle', { email })}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* メール確認成功メッセージ */}
          <Alert className="bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{t('auth.signupComplete.emailVerified')}</AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleComplete} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.signupComplete.nameLabel')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('auth.signupComplete.namePlaceholder')}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                autoComplete="name"
                autoFocus
                required
              />
              <p className="text-xs text-muted-foreground">
                {t('auth.signupComplete.nameHint')}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.signupComplete.passwordLabel')}</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.signupComplete.passwordPlaceholder')}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
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
              <p className="text-xs text-muted-foreground">
                {t('auth.signupComplete.passwordHint')}
              </p>
            </div>
            
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? t('auth.signupComplete.creating') : t('auth.signupComplete.continue')}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            {t('auth.signupComplete.terms')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
