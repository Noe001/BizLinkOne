import { useState } from "react";
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
  Globe, 
  Camera, 
  Save, 
  AlertCircle,
  Moon,
  Sun,
  Monitor,
  Mail,
  MessageSquare,
  Calendar,
  CheckSquare,
  Lock,
  Eye,
  Trash2,
  Download,
  Upload
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

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

export default function Settings() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [isDirty, setIsDirty] = useState(false);

  // Set active tab based on URL parameter
  useEffect(() => {
    const pathParts = location?.split('/');
    const tabParam = pathParts?.[2]; // /settings/[tab]
    if (tabParam && ['profile', 'notifications', 'appearance', 'security', 'privacy'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);
  
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
    theme: "system",
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
    console.log("Saving settings...");
    setIsDirty(false);
    // Here you would typically make API calls to save the settings
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleNotificationChange = (category: keyof typeof notifications, field: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
    setIsDirty(true);
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-settings">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        {isDirty && (
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details.
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
                    <Badge variant="outline">{mockUser.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(mockUser.joinDate).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={profileData.department} onValueChange={(value) => handleProfileChange('department', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="HR">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profileData.timezone} onValueChange={(value) => handleProfileChange('timezone', value)}>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Configure when you receive email notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notifications.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {key === 'mentions' && 'When someone mentions you in a message'}
                      {key === 'directMessages' && 'When you receive a direct message'}
                      {key === 'taskAssignments' && 'When you are assigned to a task'}
                      {key === 'meetingReminders' && 'Reminders before scheduled meetings'}
                      {key === 'weeklyDigest' && 'Weekly summary of your activity'}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => handleNotificationChange('email', key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Push Notifications
              </CardTitle>
              <CardDescription>
                Configure real-time push notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notifications.push).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {key === 'mentions' && 'Instant notifications for mentions'}
                      {key === 'directMessages' && 'Instant notifications for DMs'}
                      {key === 'taskDeadlines' && 'Alerts for approaching task deadlines'}
                      {key === 'meetingStart' && 'Notifications when meetings begin'}
                    </p>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => handleNotificationChange('push', key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme & Display
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'light', icon: Sun, label: 'Light' },
                    { value: 'dark', icon: Moon, label: 'Dark' },
                    { value: 'system', icon: Monitor, label: 'System' }
                  ].map((theme) => (
                    <Card 
                      key={theme.value}
                      className={`cursor-pointer transition-colors ${
                        appearance.theme === theme.value ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setAppearance(prev => ({ ...prev, theme: theme.value }))}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <theme.icon className="h-8 w-8 mb-2" />
                        <span className="text-sm font-medium">{theme.label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Accent Color</Label>
                <div className="grid grid-cols-8 gap-2">
                  {[
                    'blue', 'green', 'purple', 'red', 'orange', 'yellow', 'pink', 'indigo'
                  ].map((color) => (
                    <button
                      key={color}
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
                      onClick={() => setAppearance(prev => ({ ...prev, accentColor: color }))}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Reduce spacing and padding for a more compact interface
                    </p>
                  </div>
                  <Switch
                    checked={appearance.compactMode}
                    onCheckedChange={(checked) => setAppearance(prev => ({ ...prev, compactMode: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Sidebar Collapsed by Default</Label>
                    <p className="text-sm text-muted-foreground">
                      Start with the sidebar in collapsed state
                    </p>
                  </div>
                  <Switch
                    checked={appearance.sidebarCollapsed}
                    onCheckedChange={(checked) => setAppearance(prev => ({ ...prev, sidebarCollapsed: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Password & Authentication
              </CardTitle>
              <CardDescription>
                Manage your account security and authentication methods.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Current Password</Label>
                    <p className="text-sm text-muted-foreground">
                      Last changed 3 months ago
                    </p>
                  </div>
                  <Button variant="outline">Change Password</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    Enabled
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Active Sessions</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Current Session</p>
                      <p className="text-xs text-muted-foreground">
                        Chrome on Windows • New York, NY
                      </p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Mobile App</p>
                      <p className="text-xs text-muted-foreground">
                        iOS • Last seen 2 hours ago
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control how your information is shared and displayed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">
                      Who can see your profile information
                    </p>
                  </div>
                  <Select value={privacy.profileVisibility} onValueChange={(value) => setPrivacy(prev => ({ ...prev, profileVisibility: value }))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Everyone</SelectItem>
                      <SelectItem value="team">Team Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Online Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Let others see when you're online
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showOnlineStatus}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showOnlineStatus: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Share Activity Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Share what you're working on with your team
                    </p>
                  </div>
                  <Switch
                    checked={privacy.shareActivity}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, shareActivity: checked }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Data & Analytics</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Usage Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve the platform by sharing usage data
                    </p>
                  </div>
                  <Switch
                    checked={privacy.dataAnalytics}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, dataAnalytics: checked }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download My Data
                  </Button>
                  <Button variant="outline" className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
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
