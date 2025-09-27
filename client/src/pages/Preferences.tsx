import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { 
  Palette, 
  Volume2, 
  Moon, 
  Sun, 
  Monitor, 
  Zap, 
  Save, 
  AlertCircle,
  Bell,
  Eye,
  Globe,
  Keyboard,
  Clock
} from "lucide-react";

export default function Preferences() {
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Appearance preferences
  const [appearance, setAppearance] = useState({
    theme: "system",
    accentColor: "blue",
    fontSize: "medium",
    sidebarCollapsed: false,
    compactMode: false,
    showAvatars: true,
    animationsEnabled: true,
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    soundEnabled: true,
    soundVolume: 50,
    desktopNotifications: true,
    emailDigest: "daily",
    quietHours: false,
    quietStart: "22:00",
    quietEnd: "08:00",
  });

  // Accessibility preferences
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
  });

  // Language and region
  const [localization, setLocalization] = useState({
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    firstDayOfWeek: "sunday",
    timezone: "America/New_York",
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Saving preferences...", { appearance, notifications, accessibility, localization });
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppearanceChange = (field: string, value: any) => {
    setAppearance(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleNotificationChange = (field: string, value: any) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleAccessibilityChange = (field: string, value: boolean) => {
    setAccessibility(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleLocalizationChange = (field: string, value: string) => {
    setLocalization(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-preferences">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Customize your workspace experience and personal settings.
        </p>
        {isDirty && (
          <Button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      {isDirty && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Click "Save Changes" to apply them.
          </AlertDescription>
        </Alert>
      )}

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance & Theme
          </CardTitle>
          <CardDescription>
            Customize the visual appearance of your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'light', icon: Sun, label: 'Light', description: 'Clean and bright' },
                { value: 'dark', icon: Moon, label: 'Dark', description: 'Easy on the eyes' },
                { value: 'system', icon: Monitor, label: 'System', description: 'Follow system' }
              ].map((theme) => (
                <Card 
                  key={theme.value}
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    appearance.theme === theme.value ? 'ring-2 ring-primary border-primary' : ''
                  }`}
                  onClick={() => handleAppearanceChange('theme', theme.value)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <theme.icon className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">{theme.label}</span>
                    <span className="text-xs text-muted-foreground text-center">{theme.description}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Accent Color */}
          <div className="space-y-3">
            <Label>Accent Color</Label>
            <div className="grid grid-cols-8 gap-2">
              {[
                { name: 'blue', class: 'bg-blue-500', label: 'Blue' },
                { name: 'green', class: 'bg-green-500', label: 'Green' },
                { name: 'purple', class: 'bg-purple-500', label: 'Purple' },
                { name: 'red', class: 'bg-red-500', label: 'Red' },
                { name: 'orange', class: 'bg-orange-500', label: 'Orange' },
                { name: 'yellow', class: 'bg-yellow-500', label: 'Yellow' },
                { name: 'pink', class: 'bg-pink-500', label: 'Pink' },
                { name: 'indigo', class: 'bg-indigo-500', label: 'Indigo' }
              ].map((color) => (
                <button
                  key={color.name}
                  title={color.label}
                  className={`h-10 w-10 rounded-full ${color.class} ${
                    appearance.accentColor === color.name ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
                  } transition-all`}
                  onClick={() => handleAppearanceChange('accentColor', color.name)}
                />
              ))}
            </div>
          </div>

          <Separator />

          {/* Other Appearance Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce spacing for more content density
                </p>
              </div>
              <Switch
                checked={appearance.compactMode}
                onCheckedChange={(checked) => handleAppearanceChange('compactMode', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Show Avatars</Label>
                <p className="text-sm text-muted-foreground">
                  Display user avatars in messages and lists
                </p>
              </div>
              <Switch
                checked={appearance.showAvatars}
                onCheckedChange={(checked) => handleAppearanceChange('showAvatars', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Smooth transitions and hover effects
                </p>
              </div>
              <Switch
                checked={appearance.animationsEnabled}
                onCheckedChange={(checked) => handleAppearanceChange('animationsEnabled', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications & Sound
          </CardTitle>
          <CardDescription>
            Configure how and when you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Sound Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Play sound for new messages and alerts
                </p>
              </div>
              <Switch
                checked={notifications.soundEnabled}
                onCheckedChange={(checked) => handleNotificationChange('soundEnabled', checked)}
              />
            </div>
            
            {notifications.soundEnabled && (
              <div className="space-y-2 ml-4">
                <Label className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Volume: {notifications.soundVolume}%
                </Label>
                <Slider
                  value={[notifications.soundVolume]}
                  onValueChange={(value) => handleNotificationChange('soundVolume', value[0])}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Desktop Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Show system notifications for important updates
                </p>
              </div>
              <Switch
                checked={notifications.desktopNotifications}
                onCheckedChange={(checked) => handleNotificationChange('desktopNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Email Digest</Label>
                <p className="text-sm text-muted-foreground">
                  Receive summary emails of your activity
                </p>
              </div>
              <Select value={notifications.emailDigest} onValueChange={(value) => handleNotificationChange('emailDigest', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">
                  Pause notifications during specified hours
                </p>
              </div>
              <Switch
                checked={notifications.quietHours}
                onCheckedChange={(checked) => handleNotificationChange('quietHours', checked)}
              />
            </div>

            {notifications.quietHours && (
              <div className="ml-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <Select value={notifications.quietStart} onValueChange={(value) => handleNotificationChange('quietStart', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {`${hour}:00`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">End Time</Label>
                  <Select value={notifications.quietEnd} onValueChange={(value) => handleNotificationChange('quietEnd', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={hour} value={`${hour}:00`}>
                            {`${hour}:00`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Accessibility
          </CardTitle>
          <CardDescription>
            Configure accessibility features and assistive technology support.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>High Contrast Mode</Label>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch
              checked={accessibility.highContrast}
              onCheckedChange={(checked) => handleAccessibilityChange('highContrast', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              checked={accessibility.reducedMotion}
              onCheckedChange={(checked) => handleAccessibilityChange('reducedMotion', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                Keyboard Navigation
              </Label>
              <p className="text-sm text-muted-foreground">
                Enhanced keyboard shortcuts and navigation
              </p>
            </div>
            <Switch
              checked={accessibility.keyboardNavigation}
              onCheckedChange={(checked) => handleAccessibilityChange('keyboardNavigation', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Focus Indicators</Label>
              <p className="text-sm text-muted-foreground">
                Show clear focus indicators for keyboard navigation
              </p>
            </div>
            <Switch
              checked={accessibility.focusIndicators}
              onCheckedChange={(checked) => handleAccessibilityChange('focusIndicators', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language & Region Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language & Region
          </CardTitle>
          <CardDescription>
            Configure language, date, time, and regional formatting preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={localization.language} onValueChange={(value) => handleLocalizationChange('language', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="ko">한국어</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={localization.timezone} onValueChange={(value) => handleLocalizationChange('timezone', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select value={localization.dateFormat} onValueChange={(value) => handleLocalizationChange('dateFormat', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (US)</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (International)</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (ISO)</SelectItem>
                  <SelectItem value="DD MMM YYYY">DD MMM YYYY (Written)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Format
              </Label>
              <Select value={localization.timeFormat} onValueChange={(value) => handleLocalizationChange('timeFormat', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24 Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
