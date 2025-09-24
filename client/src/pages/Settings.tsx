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
  Settings as SettingsIcon,
  Users, 
  Shield, 
  Building, 
  Globe, 
  Save, 
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Crown,
  Mail,
  UserCheck,
  UserX,
  Calendar,
  Database,
  BarChart3,
  Clock
} from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

// Mock workspace data
const mockWorkspace = {
  id: "workspace-1",
  name: "Acme Corporation",
  domain: "acme.example.com",
  plan: "Enterprise",
  memberCount: 47,
  createdAt: "2024-01-01",
  billing: {
    plan: "Enterprise",
    seats: 50,
    usedSeats: 47,
    nextBilling: "2025-01-01",
    amount: 2500
  }
};

// Mock team members
const mockTeamMembers = [
  { id: "1", name: "John Doe", email: "john@acme.com", role: "Admin", status: "active", joinDate: "2024-01-15" },
  { id: "2", name: "Sarah Wilson", email: "sarah@acme.com", role: "Manager", status: "active", joinDate: "2024-02-01" },
  { id: "3", name: "Mike Johnson", email: "mike@acme.com", role: "Member", status: "active", joinDate: "2024-02-15" },
  { id: "4", name: "Alice Cooper", email: "alice@acme.com", role: "Member", status: "pending", joinDate: "2024-03-01" }
];

export default function Settings() {
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("general");
  const [isDirty, setIsDirty] = useState(false);

  // Set active tab based on URL parameter
  useEffect(() => {
    const pathParts = location?.split('/');
    const tabParam = pathParts?.[2]; // /settings/[tab]
    if (tabParam && ['general', 'team', 'security', 'billing'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);
  
  // Workspace settings
  const [workspaceData, setWorkspaceData] = useState({
    name: mockWorkspace.name,
    domain: mockWorkspace.domain,
    description: "A collaborative workspace for Acme Corporation team members.",
    timezone: "America/New_York",
    language: "en",
    allowGuestAccess: true,
    requireTwoFactor: false,
    sessionTimeout: 30
  });

  const handleSave = () => {
    console.log("Saving workspace settings...");
    setIsDirty(false);
    // Here you would typically make API calls to save the settings
  };

  const handleWorkspaceChange = (field: string, value: string | boolean | number) => {
    setWorkspaceData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-settings">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workspace Settings</h1>
          <p className="text-muted-foreground">
            Manage workspace configuration, team members, and organization settings.
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Management
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Billing & Plans
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Workspace Information
              </CardTitle>
              <CardDescription>
                Basic information about your workspace and organization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name">Workspace Name</Label>
                  <Input 
                    id="workspace-name"
                    value={workspaceData.name}
                    onChange={(e) => handleWorkspaceChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workspace-domain">Domain</Label>
                  <Input 
                    id="workspace-domain"
                    value={workspaceData.domain}
                    onChange={(e) => handleWorkspaceChange('domain', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace-description">Description</Label>
                <Input 
                  id="workspace-description"
                  value={workspaceData.description}
                  onChange={(e) => handleWorkspaceChange('description', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="workspace-timezone">Default Timezone</Label>
                  <Select value={workspaceData.timezone} onValueChange={(value) => handleWorkspaceChange('timezone', value)}>
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
                  <Label htmlFor="workspace-language">Default Language</Label>
                  <Select value={workspaceData.language} onValueChange={(value) => handleWorkspaceChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Access & Permissions
              </CardTitle>
              <CardDescription>
                Control who can access your workspace and how.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Guest Access</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow external users to be invited as guests
                  </p>
                </div>
                <Switch
                  checked={workspaceData.allowGuestAccess}
                  onCheckedChange={(checked) => handleWorkspaceChange('allowGuestAccess', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Management Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
                <Badge variant="secondary">{mockTeamMembers.length} members</Badge>
              </CardTitle>
              <CardDescription>
                Manage team members, roles, and permissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Invite Members
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Bulk Invite
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {mockTeamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{member.name}</p>
                          {member.role === 'Admin' && <Crown className="h-4 w-4 text-yellow-500" />}
                          <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                            {member.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={member.role} disabled={member.role === 'Admin'}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Policies
              </CardTitle>
              <CardDescription>
                Configure security settings and authentication requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Require Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Enforce 2FA for all workspace members
                  </p>
                </div>
                <Switch
                  checked={workspaceData.requireTwoFactor}
                  onCheckedChange={(checked) => handleWorkspaceChange('requireTwoFactor', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Select value={workspaceData.sessionTimeout.toString()} onValueChange={(value) => handleWorkspaceChange('sessionTimeout', parseInt(value))}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <p className="text-2xl font-bold">{mockWorkspace.billing.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Seats Used</p>
                  <p className="text-2xl font-bold">{mockWorkspace.billing.usedSeats}/{mockWorkspace.billing.seats}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Cost</p>
                  <p className="text-2xl font-bold">${mockWorkspace.billing.amount}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Next billing date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(mockWorkspace.billing.nextBilling).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="outline">Add Seats</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
