import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Camera, 
  Save, 
  AlertCircle,
  Moon,
  Sun,
  Monitor,
  Mail,
  Lock,
  Eye,
  Trash2,
  Download,
  Upload,
  ArrowLeft,
  Check,
  Loader2,
  X
} from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { useTranslation } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/ThemeProvider";

const tabs = ["profile", "notifications", "appearance", "security"] as const;
type AccountSettingsTab = (typeof tabs)[number];
// Mock user data
const mockUser = {
  id: "current-user",
  name: "John Doe",
  email: "john.doe@company.com",
  avatar: "",
  role: "Admin",
  department: "Engineering",
  joinDate: "2024-01-15",
  timezone: "America/New_York",
  language: "en"
};

export default function AccountSettings() {
  const [location, setLocation] = useLocation();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const parseTabFromLocation = (loc: string): AccountSettingsTab | null => {
    const parts = loc.split("?");
    if (parts.length < 2) {
      return null;
    }
    const params = new URLSearchParams(parts[1]);
    const tabParam = params.get("tab");
    if (tabParam && tabs.includes(tabParam as AccountSettingsTab)) {
      return tabParam as AccountSettingsTab;
    }
    return null;
  };

  const [activeTab, setActiveTab] = useState<AccountSettingsTab>(() => parseTabFromLocation(location) ?? "profile");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showAutoSaveBanner, setShowAutoSaveBanner] = useState(() => {
    // Check if user has dismissed the banner before (stored in localStorage)
    const dismissed = localStorage.getItem('autoSaveBannerDismissed');
    return dismissed !== 'true';
  });

  useEffect(() => {
    const urlTab = parseTabFromLocation(location);
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [location, activeTab]);

  const handleTabChange = (value: string) => {
    if (!tabs.includes(value as AccountSettingsTab)) {
      return;
    }
    setActiveTab(value as AccountSettingsTab);
    const splitLocation = location.split("?");
    const path = splitLocation[0];
    const params = new URLSearchParams(splitLocation[1] ?? "");
    params.set("tab", value);
    const search = params.toString();
    const newLocation = search ? `${path}?${search}` : path;
    if (newLocation !== location) {
      setLocation(newLocation, { replace: true });
    }
  };

  const roleLabels: Record<string, string> = {
    Admin: t('settings.team.roles.admin'),
    Manager: t('settings.team.roles.manager'),
    Member: t('settings.team.roles.member'),
  };

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    department: mockUser.department,
    timezone: mockUser.timezone,
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: {
      mentions: true,
      directMessages: true,
      taskAssignments: true,
      meetingReminders: true,
      weeklyDigest: false,
    },
    push: {
      mentions: true,
      directMessages: true,
      taskDeadlines: true,
      meetingStart: true,
    },
    inApp: {
      allActivity: true,
      soundEnabled: true,
      desktopNotifications: true,
    }
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    accentColor: "blue",
    sidebarCollapsed: false,
    compactMode: false,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "team",
    showOnlineStatus: true,
    shareActivity: true,
    dataAnalytics: true,
  });

  const handleSave = () => {
    console.log("Saving profile settings...");
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
    }, 1000);
  };

  const handleAutoSave = (callback: () => void) => {
    setAutoSaveStatus('saving');
    callback();
    // Simulate API call
    setTimeout(() => {
      setAutoSaveStatus('saved');
      setTimeout(() => {
        setAutoSaveStatus('idle');
      }, 2000);
    }, 500);
  };

  const dismissAutoSaveBanner = () => {
    setShowAutoSaveBanner(false);
    localStorage.setItem('autoSaveBannerDismissed', 'true');
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleNotificationChange = (category: keyof typeof notifications, field: string, value: boolean) => {
    handleAutoSave(() => {
      setNotifications(prev => ({
        ...prev,
        [category]: { ...prev[category], [field]: value }
      }));
    });
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-account-settings">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
{t('accountSettings.header.back')}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">{t('accountSettings.header.title')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('accountSettings.header.description')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Auto-save indicator for non-profile tabs */}
          {activeTab !== 'profile' && autoSaveStatus !== 'idle' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {autoSaveStatus === 'saving' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('accountSettings.autoSave.saving')}</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">{t('accountSettings.autoSave.saved')}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
{t('accountSettings.tabs.profile')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
{t('accountSettings.tabs.notifications')}
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
{t('accountSettings.tabs.appearance')}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('accountSettings.tabs.security')}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('accountSettings.profile.title')}
              </CardTitle>
              <CardDescription>
                {t('accountSettings.profile.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {mockUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{mockUser.name}</h3>
                    <Badge variant="outline">{roleLabels[mockUser.role] ?? mockUser.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('accountSettings.profile.avatar.memberSince', { date: new Date(mockUser.joinDate).toLocaleDateString() })}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      {t('accountSettings.profile.avatar.upload')}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
{t('accountSettings.profile.avatar.remove')}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('accountSettings.profile.fields.name')}</Label>
                  <Input 
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('accountSettings.profile.fields.email')}</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">{t('accountSettings.profile.fields.department')}</Label>
                  <Select value={profileData.department} onValueChange={(value) => handleProfileChange('department', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">{t('accountSettings.profile.departments.engineering')}</SelectItem>
                      <SelectItem value="Design">{t('accountSettings.profile.departments.design')}</SelectItem>
                      <SelectItem value="Marketing">{t('accountSettings.profile.departments.marketing')}</SelectItem>
                      <SelectItem value="Sales">{t('accountSettings.profile.departments.sales')}</SelectItem>
                      <SelectItem value="Support">{t('accountSettings.profile.departments.support')}</SelectItem>
                      <SelectItem value="HR">{t('accountSettings.profile.departments.humanResources')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">{t('accountSettings.profile.fields.timezone')}</Label>
                  <Select value={profileData.timezone} onValueChange={(value) => handleProfileChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">{t('settings.general.timezones.et')}</SelectItem>
                      <SelectItem value="America/Chicago">{t('settings.general.timezones.ct')}</SelectItem>
                      <SelectItem value="America/Denver">{t('settings.general.timezones.mt')}</SelectItem>
                      <SelectItem value="America/Los_Angeles">{t('settings.general.timezones.pt')}</SelectItem>
                      <SelectItem value="Europe/London">{t('settings.general.timezones.gmt')}</SelectItem>
                      <SelectItem value="Europe/Paris">{t('settings.general.timezones.cet')}</SelectItem>
                      <SelectItem value="Asia/Tokyo">{t('settings.general.timezones.jst')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Save Button */}
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setProfileData({
                      name: mockUser.name,
                      email: mockUser.email,
                      department: mockUser.department,
                      timezone: mockUser.timezone,
                    });
                    setIsDirty(false);
                  }}
                  disabled={!isDirty || isSaving}
                >
                  {t('accountSettings.actions.cancel')}
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={!isDirty || isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('accountSettings.actions.saving')}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {t('accountSettings.actions.saveProfile')}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          {/* Auto-save info banner */}
          {showAutoSaveBanner && (
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900 p-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 self-center" />
                  <AlertDescription className="text-blue-800 dark:text-blue-300">
                    {t('accountSettings.autoSave.description')}
                  </AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900 flex-shrink-0"
                  onClick={dismissAutoSaveBanner}
                  aria-label={t('accountSettings.autoSave.dismiss')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {t('accountSettings.notifications.email.title')}
              </CardTitle>
              <CardDescription>
                {t('accountSettings.notifications.email.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notifications.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t(`accountSettings.notifications.email.items.${key}.label`)}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t(`accountSettings.notifications.email.items.${key}.description`)}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => handleNotificationChange('email', key, checked)}
                    aria-label={t(`accountSettings.notifications.email.items.${key}.label`)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('accountSettings.notifications.push.title')}
              </CardTitle>
              <CardDescription>
                {t('accountSettings.notifications.push.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notifications.push).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t(`accountSettings.notifications.push.items.${key}.label`)}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t(`accountSettings.notifications.push.items.${key}.description`)}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => handleNotificationChange('push', key, checked)}
                    aria-label={t(`accountSettings.notifications.push.items.${key}.label`)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          {/* Auto-save info banner */}
          {showAutoSaveBanner && (
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900 p-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 self-center" />
                  <AlertDescription className="text-blue-800 dark:text-blue-300">
                    {t('accountSettings.autoSave.description')}
                  </AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900 flex-shrink-0"
                  onClick={dismissAutoSaveBanner}
                  aria-label={t('accountSettings.autoSave.dismiss')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {t('accountSettings.appearance.title')}
              </CardTitle>
              <CardDescription>
                {t('accountSettings.appearance.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>{t('accountSettings.appearance.themeLabel')}</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'light', icon: Sun },
                    { value: 'dark', icon: Moon },
                    { value: 'system', icon: Monitor }
                  ].map((themeOption) => (
                    <Card 
                      key={themeOption.value}
                      className={`cursor-pointer transition-colors ${
                        theme === themeOption.value ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => {
                        handleAutoSave(() => {
                          setTheme(themeOption.value as "light" | "dark" | "system");
                        });
                      }}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <themeOption.icon className="h-8 w-8 mb-2" />
                        <span className="text-sm font-medium">
                          {t(`accountSettings.appearance.themes.${themeOption.value}`)}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>{t('accountSettings.appearance.accentLabel')}</Label>
                <div className="grid grid-cols-8 gap-2">
                  {[
                    'blue', 'green', 'purple', 'red', 'orange', 'yellow', 'pink', 'indigo'
                  ].map((color) => (
                    <button
                      key={color}
                      title={t(`accountSettings.appearance.colors.${color}`)}
                      aria-label={t(`accountSettings.appearance.colors.${color}`)}
                      className={`h-8 w-8 rounded-full ${
                        color === 'blue' ? 'bg-blue-500' :
                        color === 'green' ? 'bg-green-500' :
                        color === 'purple' ? 'bg-purple-500' :
                        color === 'red' ? 'bg-red-500' :
                        color === 'orange' ? 'bg-orange-500' :
                        color === 'yellow' ? 'bg-yellow-500' :
                        color === 'pink' ? 'bg-pink-500' :
                        'bg-indigo-500'
                      } ${
                        appearance.accentColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                      }`}
                      onClick={() => {
                        handleAutoSave(() => {
                          setAppearance(prev => ({ ...prev, accentColor: color }));
                        });
                      }}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('accountSettings.appearance.options.compactMode.label')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('accountSettings.appearance.options.compactMode.description')}
                    </p>
                  </div>
                  <Switch
                    checked={appearance.compactMode}
                    onCheckedChange={(checked) => {
                      handleAutoSave(() => {
                        setAppearance(prev => ({ ...prev, compactMode: checked }));
                      });
                    }}
                    aria-label={t('accountSettings.appearance.options.compactMode.label')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('accountSettings.appearance.options.sidebarCollapsed.label')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('accountSettings.appearance.options.sidebarCollapsed.description')}
                    </p>
                  </div>
                  <Switch
                    checked={appearance.sidebarCollapsed}
                    onCheckedChange={(checked) => {
                      handleAutoSave(() => {
                        setAppearance(prev => ({ ...prev, sidebarCollapsed: checked }));
                      });
                    }}
                    aria-label={t('accountSettings.appearance.options.sidebarCollapsed.label')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security & Privacy Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Auto-save info banner */}
          {showAutoSaveBanner && (
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900 p-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 self-center" />
                  <AlertDescription className="text-blue-800 dark:text-blue-300">
                    {t('accountSettings.autoSave.description')}
                  </AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900 flex-shrink-0"
                  onClick={dismissAutoSaveBanner}
                  aria-label={t('accountSettings.autoSave.dismiss')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                {t('accountSettings.security.title')}
              </CardTitle>
              <CardDescription>
                {t('accountSettings.security.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('accountSettings.security.currentPassword.label')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('accountSettings.security.currentPassword.description')}
                    </p>
                  </div>
                  <Button variant="outline">{t('accountSettings.security.changePassword')}</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('accountSettings.security.twoFactor.label')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('accountSettings.security.twoFactor.description')}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {t('accountSettings.security.twoFactor.enabled')}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">{t('accountSettings.security.sessions.title')}</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{t('accountSettings.security.sessions.current.label')}</p>
                      <p className="text-xs text-muted-foreground">
                        {t('accountSettings.security.sessions.current.description')}
                      </p>
                    </div>
                    <Badge variant="secondary">{t('accountSettings.security.sessions.current.status')}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{t('accountSettings.security.sessions.mobile.label')}</p>
                      <p className="text-xs text-muted-foreground">
                        {t('accountSettings.security.sessions.mobile.description')}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      {t('accountSettings.security.sessions.mobile.action')}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {t('accountSettings.security.privacy.title')}
              </CardTitle>
              <CardDescription>
                {t('accountSettings.security.privacy.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('accountSettings.security.privacy.profileVisibility.label')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('accountSettings.security.privacy.profileVisibility.description')}
                    </p>
                  </div>
                  <Select value={privacy.profileVisibility} onValueChange={(value) => {
                    handleAutoSave(() => {
                      setPrivacy(prev => ({ ...prev, profileVisibility: value }));
                    });
                  }}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">{t('accountSettings.security.privacy.profileVisibility.options.everyone')}</SelectItem>
                      <SelectItem value="team">{t('accountSettings.security.privacy.profileVisibility.options.team')}</SelectItem>
                      <SelectItem value="private">{t('accountSettings.security.privacy.profileVisibility.options.private')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('accountSettings.security.privacy.showOnlineStatus.label')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('accountSettings.security.privacy.showOnlineStatus.description')}
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showOnlineStatus}
                    onCheckedChange={(checked) => {
                      handleAutoSave(() => {
                        setPrivacy(prev => ({ ...prev, showOnlineStatus: checked }));
                      });
                    }}
                    aria-label={t('accountSettings.security.privacy.showOnlineStatus.label')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('accountSettings.security.privacy.shareActivity.label')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('accountSettings.security.privacy.shareActivity.description')}
                    </p>
                  </div>
                  <Switch
                    checked={privacy.shareActivity}
                    onCheckedChange={(checked) => {
                      handleAutoSave(() => {
                        setPrivacy(prev => ({ ...prev, shareActivity: checked }));
                      });
                    }}
                    aria-label={t('accountSettings.security.privacy.shareActivity.label')}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">{t('accountSettings.security.privacy.dataAnalytics.title')}</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('accountSettings.security.privacy.dataAnalytics.usageAnalytics.label')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('accountSettings.security.privacy.dataAnalytics.usageAnalytics.description')}
                    </p>
                  </div>
                  <Switch
                    checked={privacy.dataAnalytics}
                    onCheckedChange={(checked) => {
                      handleAutoSave(() => {
                        setPrivacy(prev => ({ ...prev, dataAnalytics: checked }));
                      });
                    }}
                    aria-label={t('accountSettings.security.privacy.dataAnalytics.usageAnalytics.label')}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    {t('accountSettings.security.privacy.dataAnalytics.download')}
                  </Button>
                  <Button variant="outline" className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('accountSettings.security.privacy.dataAnalytics.delete')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
