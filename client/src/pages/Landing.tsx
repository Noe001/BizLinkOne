import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  CheckSquare, 
  FileText, 
  Calendar, 
  Users, 
  TrendingUp,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  const features = [
    {
      icon: MessageSquare,
      title: t('landing.features.chat.title'),
      description: t('landing.features.chat.description'),
    },
    {
      icon: CheckSquare,
      title: t('landing.features.tasks.title'),
      description: t('landing.features.tasks.description'),
    },
    {
      icon: FileText,
      title: t('landing.features.knowledge.title'),
      description: t('landing.features.knowledge.description'),
    },
    {
      icon: Calendar,
      title: t('landing.features.meetings.title'),
      description: t('landing.features.meetings.description'),
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: t('landing.benefits.productivity.title'),
      description: t('landing.benefits.productivity.description'),
    },
    {
      icon: Users,
      title: t('landing.benefits.collaboration.title'),
      description: t('landing.benefits.collaboration.description'),
    },
    {
      icon: Shield,
      title: t('landing.benefits.security.title'),
      description: t('landing.benefits.security.description'),
    },
    {
      icon: Globe,
      title: t('landing.benefits.anywhere.title'),
      description: t('landing.benefits.anywhere.description'),
    },
  ];

  const plans = [
    {
      name: t('landing.pricing.free.name'),
      price: t('landing.pricing.free.price'),
      description: t('landing.pricing.free.description'),
      features: [
        t('landing.pricing.free.features.users'),
        t('landing.pricing.free.features.storage'),
        t('landing.pricing.free.features.integrations'),
        t('landing.pricing.free.features.support'),
      ],
      cta: t('landing.pricing.free.cta'),
      highlighted: false,
    },
    {
      name: t('landing.pricing.pro.name'),
      price: t('landing.pricing.pro.price'),
      description: t('landing.pricing.pro.description'),
      features: [
        t('landing.pricing.pro.features.users'),
        t('landing.pricing.pro.features.storage'),
        t('landing.pricing.pro.features.integrations'),
        t('landing.pricing.pro.features.support'),
        t('landing.pricing.pro.features.analytics'),
        t('landing.pricing.pro.features.custom'),
      ],
      cta: t('landing.pricing.pro.cta'),
      highlighted: true,
    },
    {
      name: t('landing.pricing.enterprise.name'),
      price: t('landing.pricing.enterprise.price'),
      description: t('landing.pricing.enterprise.description'),
      features: [
        t('landing.pricing.enterprise.features.users'),
        t('landing.pricing.enterprise.features.storage'),
        t('landing.pricing.enterprise.features.integrations'),
        t('landing.pricing.enterprise.features.support'),
        t('landing.pricing.enterprise.features.sla'),
        t('landing.pricing.enterprise.features.sso'),
      ],
      cta: t('landing.pricing.enterprise.cta'),
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BL</span>
            </div>
            <span className="text-xl font-bold text-green-800">{t('common.appName')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation('/login')}>
              {t('landing.header.login')}
            </Button>
            <Button onClick={() => setLocation('/signup')}>
              {t('landing.header.signup')}
            </Button>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            {t('landing.hero.title')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('landing.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={() => setLocation('/signup')} className="min-w-[200px]">
              {t('landing.hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation('/login')} className="min-w-[200px]">
              {t('landing.hero.secondaryCta')}
            </Button>
          </div>
          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>{t('landing.hero.features.free')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>{t('landing.hero.features.noCard')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span>{t('landing.hero.features.instant')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 機能セクション */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('landing.features.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* メリットセクション */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('landing.benefits.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('landing.benefits.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 料金プランセクション */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('landing.pricing.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('landing.pricing.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={plan.highlighted ? 'border-green-600 border-2 shadow-lg' : ''}
              >
                <CardHeader>
                  {plan.highlighted && (
                    <div className="text-center mb-2">
                      <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {t('landing.pricing.popular')}
                      </span>
                    </div>
                  )}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.highlighted ? 'default' : 'outline'}
                    onClick={() => setLocation('/signup')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-green-600 text-white border-0">
            <CardContent className="py-16 text-center">
              <h2 className="text-3xl font-bold mb-4">
                {t('landing.cta.title')}
              </h2>
              <p className="text-lg mb-8 text-green-50 max-w-2xl mx-auto">
                {t('landing.cta.subtitle')}
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => setLocation('/signup')}
                className="min-w-[200px]"
              >
                {t('landing.cta.button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2025 {t('common.appName')}. {t('landing.footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
