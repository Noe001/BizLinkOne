import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Building2, Users, Briefcase, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

interface WorkspaceCreatePageProps {
  onWorkspaceCreate: () => void;
}

const INDUSTRY_OPTIONS = [
  'technology',
  'finance',
  'healthcare',
  'education',
  'retail',
  'manufacturing',
  'consulting',
  'other',
] as const;

const TEAM_SIZE_OPTIONS = ['1-5', '6-15', '16-50', '51-100', '100+'] as const;

type IndustryOption = (typeof INDUSTRY_OPTIONS)[number];
type TeamSizeOption = (typeof TEAM_SIZE_OPTIONS)[number];

type FormData = {
  workspaceName: string;
  workspaceUrl: string;
  description: string;
  industry: IndustryOption | '';
  teamSize: TeamSizeOption | '';
};

export default function WorkspaceCreatePage({ onWorkspaceCreate }: WorkspaceCreatePageProps) {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    workspaceName: '',
    workspaceUrl: '',
    description: '',
    industry: '',
    teamSize: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'workspaceName') {
      const url = value.toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 50);
      setFormData(prev => ({ ...prev, workspaceUrl: url }));
    }
  };

  const handleWorkspaceCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onWorkspaceCreate();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/signup')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center space-y-1">
              <CardTitle className="text-2xl">
                <span className="text-green-800">{t('common.appName')}</span>
              </CardTitle>
              <p className="text-lg font-semibold text-foreground">
                {t('auth.workspaceCreate.title')}
              </p>
            </div>
            <div className="w-8" />
          </div>
          <CardDescription className="text-center">
            {t('auth.workspaceCreate.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleWorkspaceCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspaceName">{t('auth.workspaceCreate.workspaceNameLabel')}</Label>
              <Input
                id="workspaceName"
                type="text"
                placeholder={t('auth.workspaceCreate.workspaceNamePlaceholder')}
                value={formData.workspaceName}
                onChange={(e) => handleInputChange('workspaceName', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workspaceUrl">{t('auth.workspaceCreate.workspaceUrlLabel')}</Label>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-2">bizlinkone.com/</span>
                <Input
                  id="workspaceUrl"
                  type="text"
                  placeholder={t('auth.workspaceCreate.workspaceUrlPlaceholder')}
                  value={formData.workspaceUrl}
                  onChange={(e) => handleInputChange('workspaceUrl', e.target.value)}
                  className="flex-1"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t('auth.workspaceCreate.workspaceUrlHelp')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('auth.workspaceCreate.descriptionLabel')}</Label>
              <Textarea
                id="description"
                placeholder={t('auth.workspaceCreate.descriptionPlaceholder')}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">{t('auth.workspaceCreate.industryLabel')}</Label>
                <Select value={formData.industry} onValueChange={(value: IndustryOption) => handleInputChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('auth.workspaceCreate.industryPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {t(`auth.workspaceCreate.industryOptions.${option}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize">{t('auth.workspaceCreate.teamSizeLabel')}</Label>
                <Select value={formData.teamSize} onValueChange={(value: TeamSizeOption) => handleInputChange('teamSize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('auth.workspaceCreate.teamSizePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_SIZE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {t(`auth.workspaceCreate.teamSizeOptions.${option}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('auth.workspaceCreate.creatingWorkspace') : t('auth.workspaceCreate.createWorkspace')}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-2 text-green-800" />
                <p className="text-xs font-medium">{t('auth.workspaceCreate.benefits.teamManagement')}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Briefcase className="h-6 w-6 mx-auto mb-2 text-green-800" />
                <p className="text-xs font-medium">{t('auth.workspaceCreate.benefits.projectTracking')}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Building2 className="h-6 w-6 mx-auto mb-2 text-green-800" />
                <p className="text-xs font-medium">{t('auth.workspaceCreate.benefits.integratedPlatform')}</p>
              </div>
            </div>
            
            <p className="text-xs text-center text-muted-foreground">
              {t('auth.workspaceCreate.benefitsDescription')}
            </p>

            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={() => setLocation('/login')}>
                {t('auth.workspaceCreate.backToLogin')}
              </Button>
              <Button variant="ghost" onClick={() => setLocation('/workspace/join')}>
                {t('auth.workspaceCreate.joinExisting')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
