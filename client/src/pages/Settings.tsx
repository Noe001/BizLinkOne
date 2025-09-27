import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  BarChart3
} from "lucide-react";
import { useLocation } from "wouter";
import { useTranslation } from "@/contexts/LanguageContext";

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

const timezoneOptions = [
  { value: "America/New_York", labelKey: "settings.general.timezones.et" },
  { value: "America/Chicago", labelKey: "settings.general.timezones.ct" },
  { value: "America/Denver", labelKey: "settings.general.timezones.mt" },
  { value: "America/Los_Angeles", labelKey: "settings.general.timezones.pt" },
  { value: "Europe/London", labelKey: "settings.general.timezones.gmt" },
  { value: "Europe/Paris", labelKey: "settings.general.timezones.cet" },
  { value: "Asia/Tokyo", labelKey: "settings.general.timezones.jst" }
] as const;

const languageOptions = [
  { value: "en", labelKey: "settings.general.languages.en" },
  { value: "es", labelKey: "settings.general.languages.es" },
  { value: "fr", labelKey: "settings.general.languages.fr" },
  { value: "de", labelKey: "settings.general.languages.de" },
  { value: "ja", labelKey: "settings.general.languages.ja" }
] as const;

const sessionTimeoutOptions = [
  { value: "15" },
  { value: "30" },
  { value: "60" },
  { value: "240" },
  { value: "480" }
] as const;

const roleOptions = ["Admin", "Manager", "Member"] as const;

type WorkspaceData = {
  name: string;
  domain: string;
  description: string;
  timezone: string;
  language: string;
  allowGuestAccess: boolean;
  requireTwoFactor: boolean;
  sessionTimeout: number;
};

export default function Settings() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("general");
  const [isDirty, setIsDirty] = useState(false);

  // Set active tab based on URL parameter
  useEffect(() => {
    const pathParts = location?.split("/");
    const tabParam = pathParts?.[2]; // /settings/[tab]
    if (tabParam && ["general", "team", "security", "billing"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);

  // Workspace settings
  const [workspaceData, setWorkspaceData] = useState<WorkspaceData>({
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

  const handleWorkspaceChange = <K extends keyof WorkspaceData>(field: K, value: WorkspaceData[K]) => {
    setWorkspaceData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  return (
    <div className="p-6 space-y-6" data-testid="page-settings">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {t("settings.header.description")}
        </p>
        {isDirty && (
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {t("settings.actions.saveChanges")}
          </Button>
        )}
      </div>

      {isDirty && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("settings.alert.unsaved", { action: t("settings.actions.saveChanges") })}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            {t("settings.tabs.general")}
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t("settings.tabs.team")}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t("settings.tabs.security")}
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t("settings.tabs.billing")}
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {t("settings.general.workspaceInfo.title")}
              </CardTitle>
              <CardDescription>
                {t("settings.general.workspaceInfo.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="workspace-name">{t("settings.general.fields.name")}</Label>
                  <Input
                    id="workspace-name"
                    value={workspaceData.name}
                    onChange={(e) => handleWorkspaceChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workspace-domain">{t("settings.general.fields.domain")}</Label>
                  <Input
                    id="workspace-domain"
                    value={workspaceData.domain}
                    onChange={(e) => handleWorkspaceChange("domain", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace-description">{t("settings.general.fields.description")}</Label>
                <Input
                  id="workspace-description"
                  value={workspaceData.description}
                  onChange={(e) => handleWorkspaceChange("description", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="workspace-timezone">{t("settings.general.fields.timezone")}</Label>
                  <Select value={workspaceData.timezone} onValueChange={(value) => handleWorkspaceChange("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezoneOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(option.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workspace-language">{t("settings.general.fields.language")}</Label>
                  <Select value={workspaceData.language} onValueChange={(value) => handleWorkspaceChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(option.labelKey)}
                        </SelectItem>
                      ))}
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
                {t("settings.general.access.title")}
              </CardTitle>
              <CardDescription>
                {t("settings.general.access.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("settings.general.access.guestAccess.label")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.general.access.guestAccess.description")}
                  </p>
                </div>
                <Switch
                  checked={workspaceData.allowGuestAccess}
                  onCheckedChange={(checked) => handleWorkspaceChange("allowGuestAccess", checked)}
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
                {t("settings.team.title")}
                <Badge variant="secondary">{t("settings.team.membersBadge", { count: mockTeamMembers.length })}</Badge>
              </CardTitle>
              <CardDescription>
                {t("settings.team.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("settings.team.actions.inviteMembers")}
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    {t("settings.team.actions.bulkInvite")}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {mockTeamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{member.name}</p>
                          {member.role === "Admin" && <Crown className="h-4 w-4 text-yellow-500" />}
                          <Badge variant={member.status === "active" ? "default" : "secondary"}>
                            {t(`settings.team.statuses.${member.status as "active" | "pending"}`)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={member.role} disabled={member.role === "Admin"}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map((role) => (
                            <SelectItem key={role} value={role}>
                              {t(`settings.team.roles.${role.toLowerCase()}`)}
                            </SelectItem>
                          ))}
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
                {t("settings.security.title")}
              </CardTitle>
              <CardDescription>
                {t("settings.security.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{t("settings.security.requireTwoFactor.label")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.security.requireTwoFactor.description")}
                  </p>
                </div>
                <Switch
                  checked={workspaceData.requireTwoFactor}
                  onCheckedChange={(checked) => handleWorkspaceChange("requireTwoFactor", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("settings.security.sessionTimeout.label")}</Label>
                <Select value={workspaceData.sessionTimeout.toString()} onValueChange={(value) => handleWorkspaceChange("sessionTimeout", parseInt(value, 10))}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionTimeoutOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(`settings.security.sessionTimeout.options.${option.value}`)}
                      </SelectItem>
                    ))}
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
                {t("settings.billing.currentPlan.title")}
              </CardTitle>
              <CardDescription>
                {t("settings.billing.currentPlan.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">{t("settings.billing.currentPlan.planLabel")}</p>
                  <p className="text-2xl font-bold">{mockWorkspace.billing.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("settings.billing.currentPlan.seatsLabel")}</p>
                  <p className="text-2xl font-bold">{mockWorkspace.billing.usedSeats}/{mockWorkspace.billing.seats}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("settings.billing.currentPlan.costLabel")}</p>
                  <p className="text-2xl font-bold">${mockWorkspace.billing.amount}</p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{t("settings.billing.nextBilling.title")}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(mockWorkspace.billing.nextBilling).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">{t("settings.billing.actions.changePlan")}</Button>
                  <Button variant="outline">{t("settings.billing.actions.addSeats")}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
