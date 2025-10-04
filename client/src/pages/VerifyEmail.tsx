import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

// Slack風: 確認コード入力（サインアップフロー用）
interface VerifyEmailPageProps {
  email?: string;
}

export default function VerifyEmailPage({ email: propEmail }: VerifyEmailPageProps) {
  const [location, setLocation] = useLocation();
  const { t } = useTranslation();
  const { verifyOTP, resendOTP, signUp } = useAuth();
  
  // URLからemailを取得
  const searchParams = new URLSearchParams(window.location.search);
  const emailParam = searchParams.get('email');
  const email = propEmail || emailParam || '';
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // メールアドレスがない場合はサインアップページにリダイレクト
  useEffect(() => {
    if (!email) {
      setLocation('/signup');
      return;
    }

    // ページロード時に確認コードを送信
    if (!emailSent) {
      sendVerificationCode();
    }
  }, [email]);

  // カウントダウンタイマー
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const sendVerificationCode = async () => {
    setIsSending(true);
    setError(null);

    try {
      // デモモード: example.comドメインは常に成功
      if (email.endsWith('@example.com')) {
        console.log('Demo mode: Simulating verification code sent');
        setEmailSent(true);
        setResendCooldown(60);
        setIsSending(false);
        return;
      }

      // 確認コード付きでサインアップ（Supabaseが自動的にメール送信）
      const { error: signupError } = await signUp(email, 'temp-password-' + Date.now(), email.split('@')[0]);
      
      if (signupError) {
        setError(signupError.message || t('auth.verify.sendError'));
      } else {
        setEmailSent(true);
        setResendCooldown(60);
      }
    } catch (err) {
      console.error('Send verification code error:', err);
      setError(t('auth.verify.sendError'));
    } finally {
      setIsSending(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    // 数字のみ許可
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(null);

    // 次の入力欄にフォーカス
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    
    setCode(newCode);
    
    // 最後の入力欄か、貼り付けた文字数の次の欄にフォーカス
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const codeString = code.join('');
    if (codeString.length !== 6) {
      setError(t('auth.verify.codeIncomplete'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error: verifyError } = await verifyOTP(email, codeString);
      
      if (verifyError) {
        setError(verifyError.message || t('auth.verify.error'));
        // エラー時にコードをクリア
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setSuccess(true);
        setTimeout(() => {
          setLocation(`/signup/complete?email=${encodeURIComponent(email)}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(t('auth.verify.error'));
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    await sendVerificationCode();
  };

  // 自動送信（6桁入力完了時）
  useEffect(() => {
    if (code.every(digit => digit !== '') && !isLoading && !success && emailSent) {
      handleVerify();
    }
  }, [code, emailSent]);

  if (!email) {
    return null;
  }

  if (isSending) {
    return (
      <div className="min-h-svh bg-background flex items-center justify-center px-4 py-6">
        <Card className="w-full max-w-md">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold">{t('auth.verify.sending')}</h3>
              <p className="text-sm text-muted-foreground">{t('auth.verify.pleaseWait')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-background flex items-center justify-center px-4 py-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/signup')}
              className="h-8 w-8"
              disabled={isLoading || success}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
              <CardTitle className="text-2xl">
                <span className="text-green-800">{t('common.appName')}</span>
              </CardTitle>
              <p className="mt-2 text-lg font-semibold text-foreground">
                {t('auth.verify.title')}
              </p>
            </div>
            <div className="w-8" />
          </div>
          <CardDescription className="text-center pt-2">
            {t('auth.verify.subtitle', { email })}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* メールアイコン */}
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{t('auth.verify.success')}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            {/* 6桁コード入力 */}
            <div className="space-y-2">
              <div className="flex gap-2 justify-center">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={isLoading || success}
                    className="w-12 h-14 text-center text-xl font-bold"
                    aria-label={t('auth.verify.codeDigit', { index: index + 1 })}
                  />
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                {t('auth.verify.codeHint')}
              </p>
            </div>

            {/* 再送信ボタン */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {t('auth.verify.noCode')}
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResend}
                disabled={isLoading || success || resendCooldown > 0}
                className="text-sm underline"
              >
                {resendCooldown > 0 
                  ? t('auth.verify.resendCooldown', { seconds: resendCooldown })
                  : t('auth.verify.resend')
                }
              </Button>
            </div>

            {/* 手動送信ボタン（予備） */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || success || code.some(d => !d)}
            >
              {isLoading ? t('auth.verify.verifying') : t('auth.verify.verify')}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setLocation('/login')}
              disabled={isLoading || success}
              className="text-sm"
            >
              {t('auth.verify.backToLogin')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
