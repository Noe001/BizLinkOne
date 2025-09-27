import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

interface SignupPageProps {
  onSignup: () => void;
}

export default function SignupPage({ onSignup }: SignupPageProps) {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert(t('auth.signup.passwordMismatch'));
      return;
    }
    
    if (!formData.agreeToTerms) {
      alert(t('auth.signup.termsAgreementRequired'));
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLocation('/workspace/create');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
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
            <div className="flex-1 text-center">
              <CardTitle className="text-2xl">
                <span className="text-green-800">{t('common.appName')}</span>
              </CardTitle>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {t('auth.signup.title')}
              </p>
            </div>
            <div className="w-8" />
          </div>
          <CardDescription className="text-center">
            {t('auth.signup.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.signup.nameLabel')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('auth.signup.namePlaceholder')}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                autoComplete="name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.signup.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.signup.emailPlaceholder')}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.signup.passwordLabel')}</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.signup.passwordPlaceholder')}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.signup.confirmPasswordLabel')}</Label>
              <div className="flex gap-2">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  autoComplete="new-password"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? t('auth.login.hidePassword') : t('auth.login.showPassword')}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange('agreeToTerms', !!checked)}
              />
              <Label htmlFor="terms" className="text-sm leading-none">
                {t('auth.signup.agreeToTerms')}
              </Label>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('auth.signup.creatingAccount') : t('auth.signup.createAccount')}
            </Button>
          </form>

          <Separator />

          <div className="text-center">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setLocation('/login')}
            >
              {t('auth.signup.backToLogin')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
