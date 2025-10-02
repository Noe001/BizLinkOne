import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import type { LucideIcon } from "lucide-react";
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
  BarChart3,
  Briefcase,
  ListChecks,
  CalendarDays,
  BookOpen,
  CreditCard,
  Palette,
  Image,
  Link2,
  KeyRound,
  Lock,
  Server,
  AlertTriangle,
  Download,
  FileText,
  CalendarClock,
  Video,
  MessageCircle,
  Bell,
  Smartphone,
  Bot,
  Slack,
  Zap,
  ExternalLink,
  UploadCloud
} from "lucide-react";
import { useLocation } from "wouter";
import { useTranslation } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

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
const roleOptions = ["Admin", "Manager", "Member"] as const;

type MemberPermissionKey = "projects" | "tasks" | "meetings" | "knowledge" | "billing";
type NotificationPreference = "realtime" | "hourly" | "daily" | "weekly";
type TeamMemberStatus = "active" | "pending" | "disabled";
type TeamMemberRole = typeof roleOptions[number];

interface MemberPermissions {
  projects: boolean;
  tasks: boolean;
  meetings: boolean;
  knowledge: boolean;
  billing: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  joinDate: string;
  permissions: MemberPermissions;
  notificationPreference: NotificationPreference;
  requiresTwoFactor: boolean;
}

const permissionOptions: Array<{ key: MemberPermissionKey; labelKey: string; descriptionKey: string; icon: LucideIcon }> = [
  { key: "projects", labelKey: "settings.team.dialog.permissions.projects.label", descriptionKey: "settings.team.dialog.permissions.projects.description", icon: Briefcase },
  { key: "tasks", labelKey: "settings.team.dialog.permissions.tasks.label", descriptionKey: "settings.team.dialog.permissions.tasks.description", icon: ListChecks },
  { key: "meetings", labelKey: "settings.team.dialog.permissions.meetings.label", descriptionKey: "settings.team.dialog.permissions.meetings.description", icon: CalendarDays },
  { key: "knowledge", labelKey: "settings.team.dialog.permissions.knowledge.label", descriptionKey: "settings.team.dialog.permissions.knowledge.description", icon: BookOpen },
  { key: "billing", labelKey: "settings.team.dialog.permissions.billing.label", descriptionKey: "settings.team.dialog.permissions.billing.description", icon: CreditCard }
];

const notificationOptions: Array<{ value: NotificationPreference; labelKey: string }> = [
  { value: "realtime", labelKey: "settings.team.dialog.notifications.options.realtime" },
  { value: "hourly", labelKey: "settings.team.dialog.notifications.options.hourly" },
  { value: "daily", labelKey: "settings.team.dialog.notifications.options.daily" },
  { value: "weekly", labelKey: "settings.team.dialog.notifications.options.weekly" },
];

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@acme.com",
    role: "Admin",
    status: "active",
    joinDate: "2024-01-15",
    permissions: { projects: true, tasks: true, meetings: true, knowledge: true, billing: true },
    notificationPreference: "realtime",
    requiresTwoFactor: true,
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah@acme.com",
    role: "Manager",
    status: "active",
    joinDate: "2024-02-01",
    permissions: { projects: true, tasks: true, meetings: true, knowledge: true, billing: false },
    notificationPreference: "daily",
    requiresTwoFactor: false,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@acme.com",
    role: "Member",
    status: "active",
    joinDate: "2024-02-15",
    permissions: { projects: true, tasks: true, meetings: false, knowledge: true, billing: false },
    notificationPreference: "hourly",
    requiresTwoFactor: false,
  },
  {
    id: "4",
    name: "Alice Cooper",
    email: "alice@acme.com",
    role: "Member",
    status: "pending",
    joinDate: "2024-03-01",
    permissions: { projects: false, tasks: true, meetings: true, knowledge: true, billing: false },
    notificationPreference: "weekly",
    requiresTwoFactor: false,
  },
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

type DomainRuleType = "primary" | "allowed";

interface DomainRule {
  id: string;
  domain: string;
  type: DomainRuleType;
  addedBy: string;
  addedAt: string;
}

type IpRuleStatus = "active" | "pending" | "disabled";

interface IpRule {
  id: string;
  label: string;
  cidr: string;
  location: string;
  addedBy: string;
  addedAt: string;
  status: IpRuleStatus;
}

type NotificationChannelCategory = "email" | "chat" | "mobile" | "webhook";

interface NotificationChannelSetting {
  id: string;
  nameKey: string;
  descriptionKey: string;
  category: NotificationChannelCategory;
  enabled: boolean;
  cadenceKey?: string;
  cadence?: NotificationPreference;
}

type ExportFormat = "csv" | "json";

interface ExportHistoryItem {
  id: string;
  generatedAt: string;
  initiatedBy: string;
  format: ExportFormat;
  size: string;
  status: "completed" | "failed" | "pending";
}

interface RetentionSettings {
  autoDelete: boolean;
  retentionPeriod: "30" | "90" | "180" | "365";
  exportCadence: "weekly" | "monthly" | "quarterly";
  exportsEnabled: boolean;
  lastExportAt: string;
  nextExportAt: string;
}

type ApiTokenScope = "full" | "chat" | "tasks" | "read";
type ApiTokenStatus = "active" | "revoked";

interface ApiToken {
  id: string;
  name: string;
  scope: ApiTokenScope;
  createdAt: string;
  lastUsed: string | null;
  status: ApiTokenStatus;
  expiresInDays: number;
  maskedKey: string;
}

interface AccessRequest {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  requestedAt: string;
  message?: string;
}

type DeviceTrustLevel = "trusted" | "needs_verification" | "blocked";

interface TrustedDevice {
  id: string;
  name: string;
  platform: "desktop" | "mobile";
  location: string;
  lastActive: string;
  status: DeviceTrustLevel;
  ipAddress: string;
}

interface NotificationTemplate {
  id: string;
  nameKey: string;
  descriptionKey: string;
  channel: NotificationChannelCategory;
  updatedAt: string;
  previewKey: string;
}

interface AutomationRecipe {
  id: string;
  nameKey: string;
  descriptionKey: string;
  integrationId: string;
  triggerKey: string;
  actionKey: string;
  status: "enabled" | "disabled";
}

interface UsageMetric {
  id: string;
  nameKey: string;
  usage: number;
  limit: number;
  unitKey: string;
}

interface IntegrationOption {
  id: string;
  nameKey: string;
  descriptionKey: string;
  category: "calendar" | "video" | "automation" | "chat" | "crm";
  status: "connected" | "disconnected" | "requires_action";
  lastSync: string | null;
  connectionLabelKey: string;
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

interface InvoiceRecord {
  id: string;
  number: string;
  period: string;
  amount: string;
  status: "paid" | "due";
  issuedAt: string;
  dueAt: string;
  downloadUrl: string;
}

interface AuditEvent {
  id: string;
  actor: string;
  actionKey: string;
  descriptionKey: string;
  target: string;
  createdAt: string;
  ipAddress: string;
  status: "success" | "warning" | "failure";
}

type BrandingState = {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
};

type ExportFormState = {
  cadence: RetentionSettings["exportCadence"];
  format: ExportFormat;
  recipients: string;
  includeAttachments: boolean;
};

type TeamAutomationState = {
  autoInviteGuests: boolean;
  autoAssignMentor: boolean;
  reminderCadence: "daily" | "weekly" | "monthly";
};

type NotificationPolicyState = {
  digestTime: string;
  quietHours: boolean;
  escalateTo: "admins" | "owners" | "none";
};

type PasswordPolicyState = {
  minLength: number;
  requireMixedCase: boolean;
  requireSpecial: boolean;
  rotation: number;
  lockoutAttempts: number;
};

const initialDomainRules: DomainRule[] = [
  { id: "domain-1", domain: "acme.com", type: "primary", addedBy: "John Doe", addedAt: "2024-01-02" },
  { id: "domain-2", domain: "acme.co.jp", type: "allowed", addedBy: "Sarah Wilson", addedAt: "2024-03-18" },
  { id: "domain-3", domain: "contractors.acme.com", type: "allowed", addedBy: "Mike Johnson", addedAt: "2024-05-04" },
];

const initialIpRules: IpRule[] = [
  { id: "ip-1", label: "Tokyo HQ", cidr: "203.0.113.0/24", location: "Tokyo, JP", addedBy: "Security Team", addedAt: "2024-04-10", status: "active" },
  { id: "ip-2", label: "Osaka Satellite", cidr: "198.51.100.64/27", location: "Osaka, JP", addedBy: "Security Team", addedAt: "2024-05-19", status: "active" },
  { id: "ip-3", label: "VPN Gateway", cidr: "10.15.32.0/21", location: "Global", addedBy: "Security Team", addedAt: "2024-08-01", status: "pending" },
];

const initialNotificationChannels: NotificationChannelSetting[] = [
  {
    id: "email-digest",
    nameKey: "settings.notifications.channels.emailDigest.name",
    descriptionKey: "settings.notifications.channels.emailDigest.description",
    category: "email",
    enabled: true,
    cadenceKey: "settings.notifications.channels.emailDigest.cadence",
    cadence: "daily",
  },
  {
    id: "slack-alerts",
    nameKey: "settings.notifications.channels.slackAlerts.name",
    descriptionKey: "settings.notifications.channels.slackAlerts.description",
    category: "chat",
    enabled: true,
  },
  {
    id: "mobile-push",
    nameKey: "settings.notifications.channels.mobilePush.name",
    descriptionKey: "settings.notifications.channels.mobilePush.description",
    category: "mobile",
    enabled: false,
  },
  {
    id: "daily-summary",
    nameKey: "settings.notifications.channels.dailySummary.name",
    descriptionKey: "settings.notifications.channels.dailySummary.description",
    category: "email",
    enabled: true,
    cadence: "daily",
  },
  {
    id: "webhook",
    nameKey: "settings.notifications.channels.webhook.name",
    descriptionKey: "settings.notifications.channels.webhook.description",
    category: "webhook",
    enabled: false,
  },
];

const initialIntegrations: IntegrationOption[] = [
  {
    id: "google-calendar",
    nameKey: "settings.integrations.items.googleCalendar.name",
    descriptionKey: "settings.integrations.items.googleCalendar.description",
    category: "calendar",
    status: "connected",
    lastSync: "2024-09-27T12:00:00Z",
    connectionLabelKey: "settings.integrations.status.connected",
  },
  {
    id: "outlook",
    nameKey: "settings.integrations.items.outlook.name",
    descriptionKey: "settings.integrations.items.outlook.description",
    category: "calendar",
    status: "disconnected",
    lastSync: null,
    connectionLabelKey: "settings.integrations.status.disconnected",
  },
  {
    id: "zoom",
    nameKey: "settings.integrations.items.zoom.name",
    descriptionKey: "settings.integrations.items.zoom.description",
    category: "video",
    status: "connected",
    lastSync: "2024-09-27T08:45:00Z",
    connectionLabelKey: "settings.integrations.status.connected",
  },
  {
    id: "teams",
    nameKey: "settings.integrations.items.teams.name",
    descriptionKey: "settings.integrations.items.teams.description",
    category: "video",
    status: "requires_action",
    lastSync: "2024-09-22T14:10:00Z",
    connectionLabelKey: "settings.integrations.status.requiresAction",
  },
  {
    id: "slack",
    nameKey: "settings.integrations.items.slack.name",
    descriptionKey: "settings.integrations.items.slack.description",
    category: "chat",
    status: "connected",
    lastSync: "2024-09-26T17:20:00Z",
    connectionLabelKey: "settings.integrations.status.connected",
  },
  {
    id: "zapier",
    nameKey: "settings.integrations.items.zapier.name",
    descriptionKey: "settings.integrations.items.zapier.description",
    category: "automation",
    status: "disconnected",
    lastSync: null,
    connectionLabelKey: "settings.integrations.status.disconnected",
  },
];

const retentionPeriodOptions: Array<{ value: RetentionSettings["retentionPeriod"]; labelKey: string }> = [
  { value: "30", labelKey: "settings.general.dataRetention.options.30" },
  { value: "90", labelKey: "settings.general.dataRetention.options.90" },
  { value: "180", labelKey: "settings.general.dataRetention.options.180" },
  { value: "365", labelKey: "settings.general.dataRetention.options.365" },
];

const exportCadenceOptions: Array<{ value: RetentionSettings["exportCadence"]; labelKey: string }> = [
  { value: "weekly", labelKey: "settings.general.dataRetention.modal.fields.cadenceOptions.weekly" },
  { value: "monthly", labelKey: "settings.general.dataRetention.modal.fields.cadenceOptions.monthly" },
  { value: "quarterly", labelKey: "settings.general.dataRetention.modal.fields.cadenceOptions.quarterly" },
];

const exportFormatOptions: Array<{ value: ExportFormat; labelKey: string }> = [
  { value: "csv", labelKey: "settings.general.dataRetention.modal.fields.formatOptions.csv" },
  { value: "json", labelKey: "settings.general.dataRetention.modal.fields.formatOptions.json" },
];

const initialExportHistory: ExportHistoryItem[] = [
  {
    id: "export-1",
    generatedAt: "2024-09-25T08:30:00Z",
    initiatedBy: "John Doe",
    format: "csv",
    size: "24 MB",
    status: "completed",
  },
  {
    id: "export-2",
    generatedAt: "2024-09-18T08:30:00Z",
    initiatedBy: "Automation",
    format: "json",
    size: "22 MB",
    status: "completed",
  },
  {
    id: "export-3",
    generatedAt: "2024-09-11T08:30:00Z",
    initiatedBy: "Sarah Wilson",
    format: "csv",
    size: "21 MB",
    status: "failed",
  },
];

const initialRetentionSettings: RetentionSettings = {
  autoDelete: true,
  retentionPeriod: "180",
  exportCadence: "monthly",
  exportsEnabled: true,
  lastExportAt: "2024-09-25T08:30:00Z",
  nextExportAt: "2024-10-25T08:30:00Z",
};

const initialApiTokens: ApiToken[] = [
  {
    id: "token-1",
    name: "Product analytics integration",
    scope: "read",
    createdAt: "2024-04-12T09:00:00Z",
    lastUsed: "2024-09-27T07:45:00Z",
    status: "active",
    expiresInDays: 90,
    maskedKey: "BL1A-****-9F32",
  },
  {
    id: "token-2",
    name: "Custom chat bot",
    scope: "chat",
    createdAt: "2024-06-02T15:10:00Z",
    lastUsed: "2024-09-24T18:20:00Z",
    status: "active",
    expiresInDays: 30,
    maskedKey: "BL1C-****-7A18",
  },
  {
    id: "token-3",
    name: "Legacy automation",
    scope: "tasks",
    createdAt: "2023-11-19T11:00:00Z",
    lastUsed: null,
    status: "revoked",
    expiresInDays: 0,
    maskedKey: "BL1T-****-2D44",
  },
];

const initialAccessRequests: AccessRequest[] = [
  {
    id: "request-1",
    name: "Hiroshi Tanaka",
    email: "hiroshi.tanaka@partner.co.jp",
    role: "Manager",
    requestedAt: "2024-09-26T04:15:00Z",
    message: "Needs access to coordinate the upcoming joint launch campaign.",
  },
  {
    id: "request-2",
    name: "Emily Carter",
    email: "emily.carter@acme.com",
    role: "Member",
    requestedAt: "2024-09-25T22:40:00Z",
  },
];

const initialDevices: TrustedDevice[] = [
  {
    id: "device-1",
    name: "MacBook Pro · John",
    platform: "desktop",
    location: "Tokyo, JP",
    lastActive: "2024-09-27T09:12:00Z",
    status: "trusted",
    ipAddress: "203.0.113.24",
  },
  {
    id: "device-2",
    name: "iPhone 15 · Sarah",
    platform: "mobile",
    location: "Osaka, JP",
    lastActive: "2024-09-26T20:03:00Z",
    status: "needs_verification",
    ipAddress: "198.51.100.16",
  },
  {
    id: "device-3",
    name: "Windows Desktop · Finance",
    platform: "desktop",
    location: "Tokyo, JP",
    lastActive: "2024-09-22T13:25:00Z",
    status: "blocked",
    ipAddress: "10.15.32.40",
  },
];

const notificationTemplates: NotificationTemplate[] = [
  {
    id: "digest",
    nameKey: "settings.notifications.templates.items.digest.name",
    descriptionKey: "settings.notifications.templates.items.digest.description",
    channel: "email",
    updatedAt: "2024-09-20T08:00:00Z",
    previewKey: "settings.notifications.templates.items.digest.preview",
  },
  {
    id: "slack-summary",
    nameKey: "settings.notifications.templates.items.slackSummary.name",
    descriptionKey: "settings.notifications.templates.items.slackSummary.description",
    channel: "chat",
    updatedAt: "2024-09-22T10:30:00Z",
    previewKey: "settings.notifications.templates.items.slackSummary.preview",
  },
  {
    id: "mobile-alert",
    nameKey: "settings.notifications.templates.items.mobileAlert.name",
    descriptionKey: "settings.notifications.templates.items.mobileAlert.description",
    channel: "mobile",
    updatedAt: "2024-09-18T06:15:00Z",
    previewKey: "settings.notifications.templates.items.mobileAlert.preview",
  },
];

const initialAutomationRecipes: AutomationRecipe[] = [
  {
    id: "recipe-1",
    nameKey: "settings.integrations.automation.items.calendarSync.name",
    descriptionKey: "settings.integrations.automation.items.calendarSync.description",
    integrationId: "google-calendar",
    triggerKey: "settings.integrations.automation.items.calendarSync.trigger",
    actionKey: "settings.integrations.automation.items.calendarSync.action",
    status: "enabled",
  },
  {
    id: "recipe-2",
    nameKey: "settings.integrations.automation.items.slackAlerts.name",
    descriptionKey: "settings.integrations.automation.items.slackAlerts.description",
    integrationId: "slack",
    triggerKey: "settings.integrations.automation.items.slackAlerts.trigger",
    actionKey: "settings.integrations.automation.items.slackAlerts.action",
    status: "enabled",
  },
  {
    id: "recipe-3",
    nameKey: "settings.integrations.automation.items.zapierTasks.name",
    descriptionKey: "settings.integrations.automation.items.zapierTasks.description",
    integrationId: "zapier",
    triggerKey: "settings.integrations.automation.items.zapierTasks.trigger",
    actionKey: "settings.integrations.automation.items.zapierTasks.action",
    status: "disabled",
  },
];

const usageMetrics: UsageMetric[] = [
  {
    id: "seats",
    nameKey: "settings.billing.usage.metrics.seats",
    usage: mockWorkspace.billing.usedSeats,
    limit: mockWorkspace.billing.seats,
    unitKey: "settings.billing.usage.units.members",
  },
  {
    id: "storage",
    nameKey: "settings.billing.usage.metrics.storage",
    usage: 820,
    limit: 1024,
    unitKey: "settings.billing.usage.units.gb",
  },
  {
    id: "automationRuns",
    nameKey: "settings.billing.usage.metrics.automationRuns",
    usage: 42,
    limit: 60,
    unitKey: "settings.billing.usage.units.runs",
  },
  {
    id: "apiRequests",
    nameKey: "settings.billing.usage.metrics.apiRequests",
    usage: 12000,
    limit: 20000,
    unitKey: "settings.billing.usage.units.requests",
  },
];

const initialPaymentMethods: PaymentMethod[] = [
  { id: "card-1", brand: "Visa", last4: "4242", expiry: "12/26", isDefault: true },
  { id: "card-2", brand: "American Express", last4: "3434", expiry: "05/27", isDefault: false },
];

const invoiceHistory: InvoiceRecord[] = [
  { id: "inv-2024-09", number: "INV-2024-09", period: "2024-09", amount: "$2,500", status: "paid", issuedAt: "2024-09-01", dueAt: "2024-09-15", downloadUrl: "#" },
  { id: "inv-2024-08", number: "INV-2024-08", period: "2024-08", amount: "$2,500", status: "paid", issuedAt: "2024-08-01", dueAt: "2024-08-15", downloadUrl: "#" },
  { id: "inv-2024-07", number: "INV-2024-07", period: "2024-07", amount: "$2,300", status: "paid", issuedAt: "2024-07-01", dueAt: "2024-07-15", downloadUrl: "#" },
  { id: "inv-2024-06", number: "INV-2024-06", period: "2024-06", amount: "$2,300", status: "paid", issuedAt: "2024-06-01", dueAt: "2024-06-15", downloadUrl: "#" },
];

const auditEvents: AuditEvent[] = [
  {
    id: "audit-1",
    actor: "John Doe",
    actionKey: "settings.security.audit.actions.roleUpdate",
    descriptionKey: "settings.security.audit.descriptions.roleUpdate",
    target: "Mike Johnson",
    createdAt: "2024-09-20T10:32:00Z",
    ipAddress: "203.0.113.24",
    status: "success",
  },
  {
    id: "audit-2",
    actor: "Automation Bot",
    actionKey: "settings.security.audit.actions.mfaReminder",
    descriptionKey: "settings.security.audit.descriptions.mfaReminder",
    target: "Pending members",
    createdAt: "2024-09-18T05:10:00Z",
    ipAddress: "198.51.100.10",
    status: "warning",
  },
  {
    id: "audit-3",
    actor: "Sarah Wilson",
    actionKey: "settings.security.audit.actions.ipAdded",
    descriptionKey: "settings.security.audit.descriptions.ipAdded",
    target: "VPN Gateway",
    createdAt: "2024-09-14T21:45:00Z",
    ipAddress: "10.15.32.1",
    status: "success",
  },
  {
    id: "audit-4",
    actor: "John Doe",
    actionKey: "settings.security.audit.actions.export",
    descriptionKey: "settings.security.audit.descriptions.export",
    target: "Workspace data export",
    createdAt: "2024-09-05T09:12:00Z",
    ipAddress: "203.0.113.8",
    status: "success",
  },
];

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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => mockTeamMembers);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [confirmDeleteMemberId, setConfirmDeleteMemberId] = useState<string | null>(null);
  const memberToDelete = confirmDeleteMemberId ? teamMembers.find((member) => member.id === confirmDeleteMemberId) ?? null : null;
  const [domainRules, setDomainRules] = useState<DomainRule[]>(initialDomainRules);
  const [ipRules, setIpRules] = useState<IpRule[]>(initialIpRules);
  const [notificationChannels, setNotificationChannels] = useState<NotificationChannelSetting[]>(initialNotificationChannels);
  const [integrations, setIntegrations] = useState<IntegrationOption[]>(initialIntegrations);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [selectedAuditEvent, setSelectedAuditEvent] = useState<AuditEvent | null>(null);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isBulkInviteModalOpen, setBulkInviteModalOpen] = useState(false);
  const [isCreateRoleOpen, setCreateRoleOpen] = useState(false);
  const [isAddDomainOpen, setAddDomainOpen] = useState(false);
  const [isAddIpOpen, setAddIpOpen] = useState(false);
  const [isPaymentMethodModalOpen, setPaymentMethodModalOpen] = useState(false);
  const [activeIntegrationId, setActiveIntegrationId] = useState<string | null>(null);
  const [branding, setBranding] = useState<BrandingState>({ primaryColor: "#2563eb", secondaryColor: "#1e293b", logoUrl: "", faviconUrl: "" });
  const [inviteForm, setInviteForm] = useState({ emails: "", role: "Member" as TeamMemberRole, message: "" });
  const [bulkInviteText, setBulkInviteText] = useState("");
  const [newDomain, setNewDomain] = useState<{ domain: string; type: DomainRuleType }>({ domain: "", type: "allowed" });
  const [newIpRule, setNewIpRule] = useState<{ label: string; cidr: string; location: string }>({ label: "", cidr: "", location: "" });
  const [paymentForm, setPaymentForm] = useState({ brand: "Visa", last4: "", expiry: "", setAsDefault: true });
  const [teamAutomation, setTeamAutomation] = useState<TeamAutomationState>({ autoInviteGuests: true, autoAssignMentor: true, reminderCadence: "weekly" });
  const [notificationPolicy, setNotificationPolicy] = useState<NotificationPolicyState>({ digestTime: "09:00", quietHours: false, escalateTo: "admins" });
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicyState>({ minLength: 12, requireMixedCase: true, requireSpecial: true, rotation: 90, lockoutAttempts: 5 });
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: permissionOptions.reduce<Record<MemberPermissionKey, boolean>>((acc, option) => {
      acc[option.key] = option.key !== "billing";
      return acc;
    }, {} as Record<MemberPermissionKey, boolean>),
  });
  const [integrationSettings, setIntegrationSettings] = useState<Record<string, { syncEvents: boolean; reminders: boolean; postSummary: boolean }>>({
    "google-calendar": { syncEvents: true, reminders: true, postSummary: true },
    outlook: { syncEvents: false, reminders: true, postSummary: false },
    zoom: { syncEvents: true, reminders: true, postSummary: true },
    teams: { syncEvents: true, reminders: false, postSummary: true },
    slack: { syncEvents: true, reminders: true, postSummary: true },
    zapier: { syncEvents: true, reminders: false, postSummary: false },
  });
  const [retentionSettings, setRetentionSettings] = useState<RetentionSettings>(initialRetentionSettings);
  const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>(initialExportHistory);
  const [isExportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportForm, setExportForm] = useState<ExportFormState>({
    cadence: initialRetentionSettings.exportCadence,
    format: "csv",
    recipients: "compliance@acme.com",
    includeAttachments: true,
  });
  const [apiTokens, setApiTokens] = useState<ApiToken[]>(initialApiTokens);
  const [isCreateTokenOpen, setCreateTokenOpen] = useState(false);
  const [newTokenForm, setNewTokenForm] = useState({ name: "", scope: "full" as ApiTokenScope, expiresInDays: 90 });
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [tokenToRevoke, setTokenToRevoke] = useState<ApiToken | null>(null);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>(initialAccessRequests);
  const [selectedAccessRequest, setSelectedAccessRequest] = useState<AccessRequest | null>(null);
  const [devices, setDevices] = useState<TrustedDevice[]>(initialDevices);
  const [deviceToRemove, setDeviceToRemove] = useState<TrustedDevice | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [automationRecipes, setAutomationRecipes] = useState<AutomationRecipe[]>(initialAutomationRecipes);
  const [activeRecipe, setActiveRecipe] = useState<AutomationRecipe | null>(null);

  // Set active tab based on URL parameter
  useEffect(() => {
    const pathParts = location?.split("/");
    const tabParam = pathParts?.[2]; // /settings/[tab]
    if (tabParam && ["general", "team", "security", "billing", "notifications", "integrations"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);

  const activeIntegration = activeIntegrationId ? integrations.find((integration) => integration.id === activeIntegrationId) ?? null : null;
  const activeIntegrationSettings = activeIntegration ? integrationSettings[activeIntegration.id] ?? { syncEvents: true, reminders: true, postSummary: true } : null;
  const enforcedTwoFactorCount = useMemo(
    () => teamMembers.filter((member) => member.requiresTwoFactor).length,
    [teamMembers]
  );
  const pendingTwoFactorCount = useMemo(() => teamMembers.length - enforcedTwoFactorCount, [teamMembers, enforcedTwoFactorCount]);
  const twoFactorCoverage = useMemo(
    () => (teamMembers.length ? Math.round((enforcedTwoFactorCount / teamMembers.length) * 100) : 0),
    [teamMembers.length, enforcedTwoFactorCount]
  );
  const membersByTwoFactor = useMemo(
    () => [...teamMembers].sort((a, b) => Number(b.requiresTwoFactor) - Number(a.requiresTwoFactor)),
    [teamMembers]
  );

  const handleInviteSubmit = () => {
    setInviteModalOpen(false);
    setInviteForm({ emails: "", role: "Member", message: "" });
  };

  const handleBulkInviteSubmit = () => {
    setBulkInviteModalOpen(false);
    setBulkInviteText("");
  };

  function handleBrandingChange<Field extends keyof BrandingState>(field: Field, value: BrandingState[Field]) {
    setBranding((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }

  const handleAddDomainRule = () => {
    if (!newDomain.domain.trim()) return;
    setDomainRules((prev) => [
      ...prev,
      {
        id: `domain-${Date.now()}`,
        domain: newDomain.domain.trim(),
        type: newDomain.type,
        addedBy: "System",
        addedAt: new Date().toISOString().split("T")[0],
      },
    ]);
    setNewDomain({ domain: "", type: "allowed" });
    setAddDomainOpen(false);
    setIsDirty(true);
  };

  const handleRemoveDomainRule = (id: string) => {
    setDomainRules((prev) => prev.filter((rule) => rule.id !== id));
    setIsDirty(true);
  };

  const handleAddIpRule = () => {
    if (!newIpRule.label.trim() || !newIpRule.cidr.trim()) return;
    setIpRules((prev) => [
      ...prev,
      {
        id: `ip-${Date.now()}`,
        label: newIpRule.label.trim(),
        cidr: newIpRule.cidr.trim(),
        location: newIpRule.location.trim() || "Remote",
        addedBy: "Security Team",
        addedAt: new Date().toISOString().split("T")[0],
        status: "pending",
      },
    ]);
    setNewIpRule({ label: "", cidr: "", location: "" });
    setAddIpOpen(false);
    setIsDirty(true);
  };

  const handleIpStatusToggle = (id: string, status: IpRuleStatus) => {
    setIpRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, status } : rule)));
    setIsDirty(true);
  };

  const handleNotificationToggle = (id: string, enabled: boolean) => {
    setNotificationChannels((prev) => prev.map((channel) => (channel.id === id ? { ...channel, enabled } : channel)));
    setIsDirty(true);
  };

  const handleNotificationCadenceChange = (id: string, cadence: NotificationPreference) => {
    setNotificationChannels((prev) => prev.map((channel) => (channel.id === id ? { ...channel, cadence } : channel)));
    setIsDirty(true);
  };

  const handleIntegrationStatusChange = (id: string, status: IntegrationOption["status"]) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              status,
              lastSync: status === "connected" ? new Date().toISOString() : integration.lastSync,
              connectionLabelKey:
                status === "connected"
                  ? "settings.integrations.status.connected"
                  : status === "requires_action"
                  ? "settings.integrations.status.requiresAction"
                  : "settings.integrations.status.disconnected",
            }
          : integration
      )
    );
    setIsDirty(true);
  };

  const handleMemberTwoFactorToggle = (id: string, requiresTwoFactor: boolean) => {
    setTeamMembers((prev) => prev.map((member) => (member.id === id ? { ...member, requiresTwoFactor } : member)));
    setIsDirty(true);
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.map((method) => ({ ...method, isDefault: method.id === id })));
    setIsDirty(true);
  };

  const handleAddPaymentMethod = () => {
    if (!paymentForm.last4 || !paymentForm.expiry) return;
    setPaymentMethods((prev) => {
      const updated = paymentForm.setAsDefault ? prev.map((method) => ({ ...method, isDefault: false })) : [...prev];
      return [
        ...updated,
        {
          id: `card-${Date.now()}`,
          brand: paymentForm.brand,
          last4: paymentForm.last4,
          expiry: paymentForm.expiry,
          isDefault: paymentForm.setAsDefault,
        },
      ];
    });
    setPaymentForm({ brand: "Visa", last4: "", expiry: "", setAsDefault: false });
    setPaymentMethodModalOpen(false);
    setIsDirty(true);
  };

  const formatDateTime = (value: string) => new Date(value).toLocaleString();

  const computeNextExportDate = (cadence: RetentionSettings["exportCadence"]) => {
    const next = new Date();
    if (cadence === "weekly") {
      next.setDate(next.getDate() + 7);
    } else if (cadence === "monthly") {
      next.setMonth(next.getMonth() + 1);
    } else {
      next.setMonth(next.getMonth() + 3);
    }
    next.setMinutes(0, 0, 0);
    return next.toISOString();
  };

  const handleRetentionToggle = (key: "autoDelete" | "exportsEnabled", value: boolean) => {
    setRetentionSettings((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleRetentionPeriodChange = (value: RetentionSettings["retentionPeriod"]) => {
    setRetentionSettings((prev) => ({ ...prev, retentionPeriod: value }));
    setIsDirty(true);
  };

  const handleExportDialogOpen = () => {
    setExportForm((prev) => ({
      ...prev,
      cadence: retentionSettings.exportCadence,
    }));
    setExportDialogOpen(true);
  };

  function handleExportFormChange<Field extends keyof ExportFormState>(key: Field, value: ExportFormState[Field]) {
    setExportForm((prev) => ({ ...prev, [key]: value }));
  }

  const handleSaveExportSchedule = () => {
    const nextExportAt = computeNextExportDate(exportForm.cadence);
    setRetentionSettings((prev) => ({
      ...prev,
      exportCadence: exportForm.cadence,
      exportsEnabled: true,
      nextExportAt,
    }));
    setIsDirty(true);
    setExportDialogOpen(false);
  };

  const handleRunExportNow = () => {
    const generatedAt = new Date().toISOString();
    const newEntry: ExportHistoryItem = {
      id: `export-${Date.now()}`,
      generatedAt,
      initiatedBy: "Admin",
      format: exportForm.format,
      size: "25 MB",
      status: "completed",
    };
    setExportHistory((prev) => [newEntry, ...prev].slice(0, 8));
    setRetentionSettings((prev) => ({
      ...prev,
      lastExportAt: generatedAt,
      nextExportAt: computeNextExportDate(prev.exportCadence),
    }));
    setIsDirty(true);
    setExportDialogOpen(false);
  };

  const handleCreateToken = () => {
    if (!newTokenForm.name.trim()) {
      return;
    }

    const timestamp = Date.now();
    const rawToken = `BL1-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${timestamp.toString().slice(-4)}`;
    const maskedKey = `${rawToken.slice(0, 4)}-****-${rawToken.slice(-4)}`;
    const createdAt = new Date().toISOString();

    setApiTokens((prev) => [
      {
        id: `token-${timestamp}`,
        name: newTokenForm.name.trim(),
        scope: newTokenForm.scope,
        createdAt,
        lastUsed: null,
        status: "active",
        expiresInDays: newTokenForm.expiresInDays,
        maskedKey,
      },
      ...prev,
    ]);

    setGeneratedToken(rawToken);
    setCreateTokenOpen(false);
    setNewTokenForm({ name: "", scope: "full", expiresInDays: 90 });
    setIsDirty(true);
  };

  const handleConfirmRevokeToken = () => {
    if (!tokenToRevoke) {
      return;
    }

    setApiTokens((prev) =>
      prev.map((token) => (token.id === tokenToRevoke.id ? { ...token, status: "revoked" } : token))
    );
    setTokenToRevoke(null);
    setIsDirty(true);
  };

  const handleProcessAccessRequest = (requestId: string) => {
    setAccessRequests((prev) => prev.filter((request) => request.id !== requestId));
    setSelectedAccessRequest(null);
    setIsDirty(true);
  };

  const handleVerifyDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, status: "trusted" as DeviceTrustLevel } : device
      )
    );
    setIsDirty(true);
  };

  const handleConfirmRemoveDevice = () => {
    if (!deviceToRemove) {
      return;
    }

    setDevices((prev) => prev.filter((device) => device.id !== deviceToRemove.id));
    setDeviceToRemove(null);
    setIsDirty(true);
  };

  const handleAutomationToggle = (recipeId: string, enabled: boolean) => {
    setAutomationRecipes((prev) =>
      prev.map((recipe) => (recipe.id === recipeId ? { ...recipe, status: enabled ? "enabled" : "disabled" } : recipe))
    );
    setActiveRecipe((prev) => (prev && prev.id === recipeId ? { ...prev, status: enabled ? "enabled" : "disabled" } : prev));
    setIsDirty(true);
  };

  function handleTeamAutomationChange<Field extends keyof TeamAutomationState>(field: Field, value: TeamAutomationState[Field]) {
    setTeamAutomation((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }

  function handleNotificationPolicyChange<Field extends keyof NotificationPolicyState>(field: Field, value: NotificationPolicyState[Field]) {
    setNotificationPolicy((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }

  function handlePasswordPolicyChange<Field extends keyof PasswordPolicyState>(field: Field, value: PasswordPolicyState[Field]) {
    setPasswordPolicy((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }

  const handleRolePermissionToggle = (key: MemberPermissionKey, value: boolean) => {
    setNewRole((prev) => ({ ...prev, permissions: { ...prev.permissions, [key]: value } }));
  };

  const resetRoleForm = () => {
    setNewRole({
      name: "",
      description: "",
      permissions: permissionOptions.reduce<Record<MemberPermissionKey, boolean>>((acc, option) => {
        acc[option.key] = option.key !== "billing";
        return acc;
      }, {} as Record<MemberPermissionKey, boolean>),
    });
  };

  const handleCreateRoleSubmit = () => {
    setCreateRoleOpen(false);
    resetRoleForm();
    setIsDirty(true);
  };

  const handleIntegrationSettingToggle = (id: string, field: keyof (typeof integrationSettings)[string], value: boolean) => {
    setIntegrationSettings((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    setIsDirty(true);
  };

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

  function handleWorkspaceChange<Field extends keyof WorkspaceData>(field: Field, value: WorkspaceData[Field]) {
    setWorkspaceData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }

  return (
    <div className="page-container" data-testid="page-settings">
      {/* Header */}
      <div className="page-header">
        <p className="text-muted-foreground max-w-3xl">
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
        <TabsList className="grid w-full gap-2 md:grid-cols-3 lg:grid-cols-6">
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
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t("settings.tabs.notifications")}
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            {t("settings.tabs.integrations")}
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {t("settings.general.branding.title")}
              </CardTitle>
              <CardDescription>
                {t("settings.general.branding.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("settings.general.branding.fields.primaryColor")}</Label>
                  <Input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => handleBrandingChange("primaryColor", e.target.value)}
                    className="h-10 p-1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("settings.general.branding.fields.secondaryColor")}</Label>
                  <Input
                    type="color"
                    value={branding.secondaryColor}
                    onChange={(e) => handleBrandingChange("secondaryColor", e.target.value)}
                    className="h-10 p-1"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("settings.general.branding.fields.logoUrl")}</Label>
                  <Input
                    placeholder="https://"
                    value={branding.logoUrl}
                    onChange={(e) => handleBrandingChange("logoUrl", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("settings.general.branding.fields.faviconUrl")}</Label>
                  <Input
                    placeholder="https://"
                    value={branding.faviconUrl}
                    onChange={(e) => handleBrandingChange("faviconUrl", e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-sm font-medium">{t("settings.general.branding.preview.title")}</p>
                <p className="text-xs text-muted-foreground">{t("settings.general.branding.preview.description")}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                {t("settings.general.domains.title")}
              </CardTitle>
              <CardDescription>
                {t("settings.general.domains.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{t("settings.general.domains.summary", { count: domainRules.length })}</p>
                  <p className="text-xs text-muted-foreground">{t("settings.general.domains.help")}</p>
                </div>
                <Button variant="outline" onClick={() => setAddDomainOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("settings.general.domains.actions.addDomain")}
                </Button>
              </div>

              <div className="space-y-3">
                {domainRules.map((rule) => (
                  <div key={rule.id} className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium">{rule.domain}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("settings.general.domains.metadata", { addedBy: rule.addedBy, addedAt: rule.addedAt })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.type === "primary" ? "default" : "secondary"}>
                        {t(`settings.general.domains.types.${rule.type}`)}
                      </Badge>
                      {rule.type !== "primary" && (
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveDomainRule(rule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5" />
                {t("settings.general.dataRetention.title")}
              </CardTitle>
              <CardDescription>{t("settings.general.dataRetention.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{t("settings.general.dataRetention.autoDelete.label")}</p>
                    <p className="text-xs text-muted-foreground">{t("settings.general.dataRetention.autoDelete.description")}</p>
                  </div>
                  <Switch checked={retentionSettings.autoDelete} onCheckedChange={(checked) => handleRetentionToggle("autoDelete", Boolean(checked))} />
                </div>
                <div className="space-y-2">
                  <Label>{t("settings.general.dataRetention.retentionPeriod.label")}</Label>
                  <Select value={retentionSettings.retentionPeriod} onValueChange={handleRetentionPeriodChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {retentionPeriodOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(option.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{t("settings.general.dataRetention.retentionPeriod.helper")}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{t("settings.general.dataRetention.exports.label")}</p>
                  <p className="text-xs text-muted-foreground">{t("settings.general.dataRetention.exports.description")}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>{t("settings.general.dataRetention.lastExport", { value: formatDateTime(retentionSettings.lastExportAt) })}</span>
                    <span>{t("settings.general.dataRetention.nextExport", { value: formatDateTime(retentionSettings.nextExportAt) })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={retentionSettings.exportsEnabled} onCheckedChange={(checked) => handleRetentionToggle("exportsEnabled", Boolean(checked))} />
                  <Button variant="outline" onClick={handleExportDialogOpen} className="gap-2">
                    <CalendarClock className="h-4 w-4" />
                    {t("settings.general.dataRetention.exports.actions.configure")}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{t("settings.general.dataRetention.history.title")}</p>
                  <Button variant="ghost" size="sm" onClick={handleExportDialogOpen}>
                    {t("settings.general.dataRetention.history.actions.schedule")}
                  </Button>
                </div>
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("settings.general.dataRetention.history.table.generatedAt")}</TableHead>
                        <TableHead>{t("settings.general.dataRetention.history.table.format")}</TableHead>
                        <TableHead>{t("settings.general.dataRetention.history.table.size")}</TableHead>
                        <TableHead>{t("settings.general.dataRetention.history.table.initiatedBy")}</TableHead>
                        <TableHead className="text-right">{t("settings.general.dataRetention.history.table.status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exportHistory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{formatDateTime(item.generatedAt)}</TableCell>
                          <TableCell>{item.format.toUpperCase()}</TableCell>
                          <TableCell>{item.size}</TableCell>
                          <TableCell>{item.initiatedBy}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={item.status === "completed" ? "default" : item.status === "pending" ? "secondary" : "destructive"}>
                              {t(`settings.general.dataRetention.history.status.${item.status}`)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                {t("settings.general.apiAccess.title")}
              </CardTitle>
              <CardDescription>{t("settings.general.apiAccess.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{t("settings.general.apiAccess.summary", { count: apiTokens.filter((token) => token.status === "active").length })}</p>
                  <p className="text-xs text-muted-foreground">{t("settings.general.apiAccess.helper")}</p>
                </div>
                <Button className="gap-2" onClick={() => setCreateTokenOpen(true)}>
                  <Plus className="h-4 w-4" />
                  {t("settings.general.apiAccess.actions.create")}
                </Button>
              </div>
              <div className="space-y-3">
                {apiTokens.map((token) => (
                  <div key={token.id} className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{token.name}</p>
                        <Badge variant="outline">{t(`settings.general.apiAccess.scopes.${token.scope}`)}</Badge>
                        <Badge variant={token.status === "active" ? "default" : "secondary"}>
                          {t(`settings.general.apiAccess.status.${token.status}`)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{t("settings.general.apiAccess.createdAt", { value: formatDateTime(token.createdAt) })}</p>
                      <p className="text-xs text-muted-foreground">
                        {token.lastUsed
                          ? t("settings.general.apiAccess.lastUsed.value", { value: formatDateTime(token.lastUsed) })
                          : t("settings.general.apiAccess.lastUsed.never")}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">{token.maskedKey}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="uppercase">
                        {t("settings.general.apiAccess.expiresIn", { days: token.expiresInDays })}
                      </Badge>
                      {token.status === "active" ? (
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setTokenToRevoke(token)}>
                          {t("settings.general.apiAccess.actions.revoke")}
                        </Button>
                      ) : (
                        <Badge variant="outline">{t("settings.general.apiAccess.status.revoked")}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {t("settings.team.requests.title")}
                {accessRequests.length > 0 && (
                  <Badge variant="outline">{t("settings.team.requests.badge", { count: accessRequests.length })}</Badge>
                )}
              </CardTitle>
              <CardDescription>{t("settings.team.requests.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {accessRequests.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{t("settings.team.requests.empty")}</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {accessRequests.map((request) => (
                    <div key={request.id} className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{request.name}</p>
                        <p className="text-sm text-muted-foreground">{request.email}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span>{t("settings.team.requests.requestedAt", { value: formatDateTime(request.requestedAt) })}</span>
                          <Badge variant="secondary">{t(`settings.team.roles.${request.role.toLowerCase()}`)}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedAccessRequest(request)}>
                          {t("settings.team.requests.actions.review")}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleProcessAccessRequest(request.id)}>
                          {t("settings.team.requests.actions.dismiss")}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                {t("settings.integrations.automation.title")}
              </CardTitle>
              <CardDescription>{t("settings.integrations.automation.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {automationRecipes.map((recipe) => (
                <div key={recipe.id} className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{t(recipe.nameKey)}</p>
                    <p className="text-sm text-muted-foreground">{t(recipe.descriptionKey)}</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>{t("settings.integrations.automation.trigger", { value: t(recipe.triggerKey) })}</p>
                      <p>{t("settings.integrations.automation.action", { value: t(recipe.actionKey) })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={recipe.status === "enabled"}
                      onCheckedChange={(checked) => handleAutomationToggle(recipe.id, Boolean(checked))}
                      aria-label={t("settings.integrations.automation.actions.toggle", { name: t(recipe.nameKey) })}
                    />
                    <Button variant="ghost" size="sm" onClick={() => setActiveRecipe(recipe)}>
                      {t("settings.integrations.automation.actions.view")}
                    </Button>
                  </div>
                </div>
              ))}
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
                <Badge variant="secondary">{t("settings.team.membersBadge", { count: teamMembers.length })}</Badge>
              </CardTitle>
              <CardDescription>
                {t("settings.team.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button onClick={() => setInviteModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("settings.team.actions.inviteMembers")}
                  </Button>
                  <Button variant="outline" onClick={() => setBulkInviteModalOpen(true)}>
                    <Mail className="h-4 w-4 mr-2" />
                    {t("settings.team.actions.bulkInvite")}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {teamMembers.map((member) => {
                  const statusVariant = member.status === "active" ? "default" : member.status === "pending" ? "secondary" : "outline";
                  const statusLabel = t(`settings.team.statuses.${member.status}`);
                  const notificationLabel = t(`settings.team.dialog.notifications.options.${member.notificationPreference}`);

                  return (
                    <div key={member.id} className="flex flex-col gap-4 rounded-lg border p-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-1 items-start gap-3">
                        <Avatar className="h-11 w-11">
                          <AvatarFallback>
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{member.name}</p>
                            {member.role === "Admin" && <Crown className="h-4 w-4 text-yellow-500" />}
                            <Badge variant={statusVariant}>{statusLabel}</Badge>
                            {member.requiresTwoFactor && (
                              <Badge variant="secondary" className="text-xs">
                                {t("settings.team.badges.mfaEnforced")}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {t("settings.team.dialog.notifications.summary", { cadence: notificationLabel })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={member.role}
                          disabled={member.role === "Admin"}
                          onValueChange={(value) =>
                            setTeamMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, role: value as typeof m.role } : m)))
                          }
                        >
                          <SelectTrigger className="w-40">
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

                        <Button variant="ghost" size="sm" onClick={() => setEditingMember(member)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setConfirmDeleteMemberId(member.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{t("settings.team.rolesCard.title")}</p>
                      <p className="text-sm text-muted-foreground">{t("settings.team.rolesCard.description")}</p>
                    </div>
                    <Button size="sm" onClick={() => setCreateRoleOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t("settings.team.rolesCard.actions.create")}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {roleOptions.map((role) => (
                      <div key={role} className="flex items-center justify-between rounded-md border p-2">
                        <div>
                          <p className="text-sm font-medium">{t(`settings.team.roles.${role.toLowerCase()}`)}</p>
                          <p className="text-xs text-muted-foreground">{t(`settings.team.rolesDescriptions.${role.toLowerCase()}`)}</p>
                        </div>
                        <Badge variant="outline" className="uppercase">
                          {t(`settings.team.roles.${role.toLowerCase()}`)}
                        </Badge>
                      </div>
                    ))}
                    <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                      {t("settings.team.rolesCard.hint")}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-4">
                  <div className="space-y-1">
                    <p className="font-medium">{t("settings.team.automation.title")}</p>
                    <p className="text-sm text-muted-foreground">{t("settings.team.automation.description")}</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{t("settings.team.automation.inviteGuests.label")}</p>
                        <p className="text-xs text-muted-foreground">{t("settings.team.automation.inviteGuests.description")}</p>
                      </div>
                      <Switch
                        checked={teamAutomation.autoInviteGuests}
                        onCheckedChange={(checked) => handleTeamAutomationChange("autoInviteGuests", Boolean(checked))}
                      />
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{t("settings.team.automation.assignMentor.label")}</p>
                        <p className="text-xs text-muted-foreground">{t("settings.team.automation.assignMentor.description")}</p>
                      </div>
                      <Switch
                        checked={teamAutomation.autoAssignMentor}
                        onCheckedChange={(checked) => handleTeamAutomationChange("autoAssignMentor", Boolean(checked))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("settings.team.automation.reminder.label")}</Label>
                      <Select
                        value={teamAutomation.reminderCadence}
                        onValueChange={(value) => handleTeamAutomationChange("reminderCadence", value as typeof teamAutomation.reminderCadence)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">{t("settings.team.automation.reminder.options.daily")}</SelectItem>
                          <SelectItem value="weekly">{t("settings.team.automation.reminder.options.weekly")}</SelectItem>
                          <SelectItem value="monthly">{t("settings.team.automation.reminder.options.monthly")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">{t("settings.team.automation.reminder.helper")}</p>
                    </div>
                  </div>
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                {t("settings.security.mfa.title")}
              </CardTitle>
              <CardDescription>{t("settings.security.mfa.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium uppercase text-muted-foreground">{t("settings.security.mfa.metrics.enforced")}</p>
                  <p className="text-2xl font-semibold">{enforcedTwoFactorCount}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium uppercase text-muted-foreground">{t("settings.security.mfa.metrics.pending")}</p>
                  <p className="text-2xl font-semibold">{pendingTwoFactorCount}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs font-medium uppercase text-muted-foreground">{t("settings.security.mfa.metrics.coverage")}</p>
                  <p className="text-2xl font-semibold">{twoFactorCoverage}%</p>
                </div>
              </div>
              {teamMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("settings.security.mfa.empty")}</p>
              ) : (
                <div className="space-y-3">
                  {membersByTwoFactor.map((member) => (
                    <div key={member.id} className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={member.requiresTwoFactor ? "default" : "secondary"}>
                          {member.requiresTwoFactor
                            ? t("settings.security.mfa.badges.enabled")
                            : t("settings.security.mfa.badges.pending")}
                        </Badge>
                        <Switch
                          checked={member.requiresTwoFactor}
                          onCheckedChange={(checked) => handleMemberTwoFactorToggle(member.id, Boolean(checked))}
                          aria-label={t("settings.security.mfa.actions.toggle", { name: member.name })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                {t("settings.security.ip.title")}
              </CardTitle>
              <CardDescription>{t("settings.security.ip.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{t("settings.security.ip.summary", { count: ipRules.length })}</p>
                  <p className="text-xs text-muted-foreground">{t("settings.security.ip.helper")}</p>
                </div>
                <Button variant="outline" onClick={() => setAddIpOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("settings.security.ip.actions.add")}
                </Button>
              </div>
              <div className="space-y-3">
                {ipRules.map((rule) => (
                  <div key={rule.id} className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-medium">{rule.label}</p>
                      <p className="text-sm text-muted-foreground">{rule.cidr}</p>
                      <p className="text-xs text-muted-foreground">{t("settings.security.ip.metadata", { location: rule.location, addedAt: rule.addedAt })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={rule.status === "active" ? "default" : rule.status === "pending" ? "secondary" : "outline"}>
                        {t(`settings.security.ip.statuses.${rule.status}`)}
                      </Badge>
                      <Select value={rule.status} onValueChange={(value) => handleIpStatusToggle(rule.id, value as IpRuleStatus)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">{t("settings.security.ip.statuses.active")}</SelectItem>
                          <SelectItem value="pending">{t("settings.security.ip.statuses.pending")}</SelectItem>
                          <SelectItem value="disabled">{t("settings.security.ip.statuses.disabled")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                {t("settings.security.devices.title")}
              </CardTitle>
              <CardDescription>{t("settings.security.devices.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {devices.map((device) => (
                <div key={device.id} className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{device.name}</p>
                    <p className="text-sm text-muted-foreground">{device.location}</p>
                    <p className="text-xs text-muted-foreground">{t("settings.security.devices.lastActive", { value: formatDateTime(device.lastActive) })}</p>
                    <p className="text-xs text-muted-foreground">{t("settings.security.devices.ipLabel", { value: device.ipAddress })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        device.status === "trusted" ? "default" : device.status === "needs_verification" ? "secondary" : "destructive"
                      }
                    >
                      {t(`settings.security.devices.status.${device.status}`)}
                    </Badge>
                    {device.status === "needs_verification" && (
                      <Button size="sm" variant="outline" onClick={() => handleVerifyDevice(device.id)}>
                        {t("settings.security.devices.actions.verify")}
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-red-600" onClick={() => setDeviceToRemove(device)}>
                      {t("settings.security.devices.actions.revoke")}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                {t("settings.security.password.title")}
              </CardTitle>
              <CardDescription>{t("settings.security.password.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("settings.security.password.minLength.label")}</Label>
                  <Input
                    type="number"
                    min={8}
                    value={passwordPolicy.minLength}
                    onChange={(e) => handlePasswordPolicyChange("minLength", Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">{t("settings.security.password.minLength.helper")}</p>
                </div>
                <div className="space-y-2">
                  <Label>{t("settings.security.password.rotation.label")}</Label>
                  <Select value={passwordPolicy.rotation.toString()} onValueChange={(value) => handlePasswordPolicyChange("rotation", Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">{t("settings.security.password.rotation.options.30")}</SelectItem>
                      <SelectItem value="60">{t("settings.security.password.rotation.options.60")}</SelectItem>
                      <SelectItem value="90">{t("settings.security.password.rotation.options.90")}</SelectItem>
                      <SelectItem value="180">{t("settings.security.password.rotation.options.180")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{t("settings.security.password.rotation.helper")}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{t("settings.security.password.requireMixedCase.label")}</p>
                    <p className="text-xs text-muted-foreground">{t("settings.security.password.requireMixedCase.description")}</p>
                  </div>
                  <Switch
                    checked={passwordPolicy.requireMixedCase}
                    onCheckedChange={(checked) => handlePasswordPolicyChange("requireMixedCase", Boolean(checked))}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{t("settings.security.password.requireSpecial.label")}</p>
                    <p className="text-xs text-muted-foreground">{t("settings.security.password.requireSpecial.description")}</p>
                  </div>
                  <Switch
                    checked={passwordPolicy.requireSpecial}
                    onCheckedChange={(checked) => handlePasswordPolicyChange("requireSpecial", Boolean(checked))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("settings.security.password.lockout.label")}</Label>
                <Input
                  type="number"
                  min={3}
                  value={passwordPolicy.lockoutAttempts}
                  onChange={(e) => handlePasswordPolicyChange("lockoutAttempts", Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">{t("settings.security.password.lockout.helper")}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("settings.security.audit.title")}
              </CardTitle>
              <CardDescription>{t("settings.security.audit.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("settings.security.audit.table.actor")}</TableHead>
                      <TableHead>{t("settings.security.audit.table.action")}</TableHead>
                      <TableHead>{t("settings.security.audit.table.target")}</TableHead>
                      <TableHead>{t("settings.security.audit.table.time")}</TableHead>
                      <TableHead className="text-right">{t("settings.security.audit.table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.actor}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant={event.status === "success" ? "default" : event.status === "warning" ? "secondary" : "destructive"}>
                              {t(`settings.security.audit.statuses.${event.status}`)}
                            </Badge>
                            <span>{t(event.actionKey)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{event.target}</TableCell>
                        <TableCell>{formatDateTime(event.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedAuditEvent(event)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {t("settings.security.audit.viewEvent")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t("settings.notifications.channels.title")}
              </CardTitle>
              <CardDescription>
                {t("settings.notifications.channels.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationChannels.map((channel) => (
                <div key={channel.id} className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{t(channel.nameKey)}</p>
                      <Badge variant="outline">{t(`settings.notifications.categories.${channel.category}`)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{t(channel.descriptionKey)}</p>
                    {channel.id === "slack-alerts" && (
                      <Button variant="outline" size="sm" onClick={() => setActiveIntegrationId("slack")}
                        className="w-fit">
                        <Slack className="mr-2 h-4 w-4" />
                        {t("settings.notifications.channels.actions.configureSlack")}
                      </Button>
                    )}
                    {channel.id === "webhook" && (
                      <Button variant="outline" size="sm" onClick={() => setActiveIntegrationId("zapier")}
                        className="w-fit">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {t("settings.notifications.channels.actions.configureWebhook")}
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
                    {channel.cadence && (
                      <Select
                        value={channel.cadence}
                        onValueChange={(value) => handleNotificationCadenceChange(channel.id, value as NotificationPreference)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {notificationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {t(option.labelKey)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <Switch
                      checked={channel.enabled}
                      onCheckedChange={(checked) => handleNotificationToggle(channel.id, Boolean(checked))}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                {t("settings.notifications.policy.title")}
              </CardTitle>
              <CardDescription>{t("settings.notifications.policy.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("settings.notifications.policy.digestTime.label")}</Label>
                  <Select value={notificationPolicy.digestTime} onValueChange={(value) => handleNotificationPolicyChange("digestTime", value as typeof notificationPolicy.digestTime)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "08:00",
                        "12:00",
                        "18:00",
                      ].map((time) => (
                        <SelectItem key={time} value={time}>
                          {t("settings.notifications.policy.digestTime.option", { time })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{t("settings.notifications.policy.digestTime.helper")}</p>
                </div>
                <div className="space-y-2">
                  <Label>{t("settings.notifications.policy.escalation.label")}</Label>
                  <Select value={notificationPolicy.escalateTo} onValueChange={(value) => handleNotificationPolicyChange("escalateTo", value as typeof notificationPolicy.escalateTo)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admins">{t("settings.notifications.policy.escalation.options.admins")}</SelectItem>
                      <SelectItem value="owners">{t("settings.notifications.policy.escalation.options.owners")}</SelectItem>
                      <SelectItem value="none">{t("settings.notifications.policy.escalation.options.none")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{t("settings.notifications.policy.escalation.helper")}</p>
                </div>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{t("settings.notifications.policy.quietHours.label")}</p>
                  <p className="text-xs text-muted-foreground">{t("settings.notifications.policy.quietHours.description")}</p>
                </div>
                <Switch
                  checked={notificationPolicy.quietHours}
                  onCheckedChange={(checked) => handleNotificationPolicyChange("quietHours", Boolean(checked))}
                />
              </div>
              <Button variant="outline" className="w-fit" onClick={() => setActiveIntegrationId("slack")}
              >
                <Bell className="mr-2 h-4 w-4" />
                {t("settings.notifications.policy.actions.sendTest")}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                {t("settings.notifications.templates.title")}
              </CardTitle>
              <CardDescription>{t("settings.notifications.templates.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {notificationTemplates.map((template) => (
                <div key={template.id} className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{t(template.nameKey)}</p>
                      <Badge variant="outline">{t(`settings.notifications.categories.${template.channel}`)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{t(template.descriptionKey)}</p>
                    <p className="text-xs text-muted-foreground">{t("settings.notifications.templates.updated", { value: formatDateTime(template.updatedAt) })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(template)}>
                      {t("settings.notifications.templates.actions.preview")}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                {t("settings.integrations.title")}
              </CardTitle>
              <CardDescription>{t("settings.integrations.description")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {integrations.map((integration) => {
                const isConnected = integration.status === "connected";
                const isRequiresAction = integration.status === "requires_action";
                return (
                  <div key={integration.id} className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{t(integration.nameKey)}</p>
                        <Badge variant={isConnected ? "default" : isRequiresAction ? "secondary" : "outline"}>
                          {t(integration.connectionLabelKey)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{t(integration.descriptionKey)}</p>
                      {integration.lastSync && (
                        <p className="text-xs text-muted-foreground">
                          {t("settings.integrations.lastSync", { value: formatDateTime(integration.lastSync) })}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 md:flex-row">
                      <Button
                        variant={isConnected ? "outline" : "default"}
                        onClick={() =>
                          handleIntegrationStatusChange(
                            integration.id,
                            isConnected ? "disconnected" : "connected"
                          )
                        }
                      >
                        {isConnected ? t("settings.integrations.actions.disconnect") : t("settings.integrations.actions.connect")}
                      </Button>
                      <Button variant="ghost" onClick={() => setActiveIntegrationId(integration.id)}>
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        {t("settings.integrations.actions.configure")}
                      </Button>
                    </div>
                  </div>
                );
              })}
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t("settings.billing.paymentMethods.title")}
                </CardTitle>
                <CardDescription>{t("settings.billing.paymentMethods.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" onClick={() => setPaymentMethodModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("settings.billing.paymentMethods.actions.add")}
                </Button>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-medium">{method.brand} •••• {method.last4}</p>
                        <p className="text-xs text-muted-foreground">{t("settings.billing.paymentMethods.expires", { expiry: method.expiry })}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.isDefault ? (
                          <Badge variant="secondary">{t("settings.billing.paymentMethods.default")}</Badge>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => handleSetDefaultPaymentMethod(method.id)}>
                            {t("settings.billing.paymentMethods.actions.setDefault")}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t("settings.billing.invoices.title")}
                </CardTitle>
                <CardDescription>{t("settings.billing.invoices.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("settings.billing.invoices.table.number")}</TableHead>
                        <TableHead>{t("settings.billing.invoices.table.period")}</TableHead>
                        <TableHead>{t("settings.billing.invoices.table.amount")}</TableHead>
                        <TableHead>{t("settings.billing.invoices.table.status")}</TableHead>
                        <TableHead className="text-right">{t("settings.billing.invoices.table.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoiceHistory.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.number}</TableCell>
                          <TableCell>{invoice.period}</TableCell>
                          <TableCell>{invoice.amount}</TableCell>
                          <TableCell>
                            <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
                              {t(`settings.billing.invoices.statuses.${invoice.status}`)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                              <Download className="mr-2 h-4 w-4" />
                              {t("settings.billing.invoices.actions.view")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button variant="outline" className="w-fit">
                  <Download className="mr-2 h-4 w-4" />
                  {t("settings.billing.invoices.actions.exportAll")}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {t("settings.billing.usage.title")}
              </CardTitle>
              <CardDescription>{t("settings.billing.usage.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {usageMetrics.map((metric) => {
                const percent = metric.limit ? Math.min(100, Math.round((metric.usage / metric.limit) * 100)) : 0;
                const remaining = metric.limit - metric.usage;
                return (
                  <div key={metric.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{t(metric.nameKey)}</span>
                      <span className="text-muted-foreground">
                        {metric.usage}/{metric.limit} {t(metric.unitKey)}
                      </span>
                    </div>
                    <Progress value={percent} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {t("settings.billing.usage.remaining", { value: Math.max(0, remaining), unit: t(metric.unitKey) })}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Data export schedule */}
      <Dialog open={isExportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("settings.general.dataRetention.modal.title")}</DialogTitle>
            <DialogDescription>{t("settings.general.dataRetention.modal.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("settings.general.dataRetention.modal.fields.cadence")}</Label>
              <Select
                value={exportForm.cadence}
                onValueChange={(value) => handleExportFormChange("cadence", value as RetentionSettings["exportCadence"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exportCadenceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("settings.general.dataRetention.modal.fields.format")}</Label>
              <Select value={exportForm.format} onValueChange={(value) => handleExportFormChange("format", value as ExportFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exportFormatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("settings.general.dataRetention.modal.fields.recipients")}</Label>
              <Input
                value={exportForm.recipients}
                onChange={(e) => handleExportFormChange("recipients", e.target.value)}
                placeholder="compliance@acme.com"
              />
              <p className="text-xs text-muted-foreground">{t("settings.general.dataRetention.modal.fields.recipientsHelper")}</p>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">{t("settings.general.dataRetention.modal.fields.includeAttachments.label")}</p>
                <p className="text-xs text-muted-foreground">{t("settings.general.dataRetention.modal.fields.includeAttachments.description")}</p>
              </div>
              <Switch
                checked={exportForm.includeAttachments}
                onCheckedChange={(checked) => handleExportFormChange("includeAttachments", Boolean(checked))}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setExportDialogOpen(false)}>{t("common.cancel")}</Button>
              <Button variant="outline" className="gap-2" onClick={handleRunExportNow}>
                <Download className="h-4 w-4" />
                {t("settings.general.dataRetention.modal.actions.runNow")}
              </Button>
            </div>
            <Button onClick={handleSaveExportSchedule}>{t("settings.general.dataRetention.modal.actions.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create API token */}
      <Dialog open={isCreateTokenOpen} onOpenChange={setCreateTokenOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("settings.general.apiAccess.modal.title")}</DialogTitle>
            <DialogDescription>{t("settings.general.apiAccess.modal.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("settings.general.apiAccess.modal.fields.name")}</Label>
              <Input value={newTokenForm.name} onChange={(e) => setNewTokenForm((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>{t("settings.general.apiAccess.modal.fields.scope")}</Label>
              <Select
                value={newTokenForm.scope}
                onValueChange={(value) => setNewTokenForm((prev) => ({ ...prev, scope: value as ApiTokenScope }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["full", "chat", "tasks", "read"] as ApiTokenScope[]).map((scope) => (
                    <SelectItem key={scope} value={scope}>
                      {t(`settings.general.apiAccess.scopes.${scope}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("settings.general.apiAccess.modal.fields.expires")}</Label>
              <Select
                value={newTokenForm.expiresInDays.toString()}
                onValueChange={(value) => setNewTokenForm((prev) => ({ ...prev, expiresInDays: Number(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[30, 60, 90, 180].map((days) => (
                    <SelectItem key={days} value={days.toString()}>
                      {t("settings.general.apiAccess.modal.fields.expiresOption", { days })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateTokenOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleCreateToken}>{t("settings.general.apiAccess.modal.actions.create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generated token */}
      <Dialog open={Boolean(generatedToken)} onOpenChange={(open) => !open && setGeneratedToken(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("settings.general.apiAccess.generated.title")}</DialogTitle>
            <DialogDescription>{t("settings.general.apiAccess.generated.description")}</DialogDescription>
          </DialogHeader>
          {generatedToken && (
            <div className="space-y-3">
              <div className="rounded-md border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground">{t("settings.general.apiAccess.generated.helper")}</p>
                <p className="mt-2 font-mono text-sm">{generatedToken}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setGeneratedToken(null)}>{t("common.close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke token */}
      <AlertDialog open={Boolean(tokenToRevoke)} onOpenChange={(open) => !open && setTokenToRevoke(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("settings.general.apiAccess.revoke.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("settings.general.apiAccess.revoke.description", { name: tokenToRevoke?.name ?? "" })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTokenToRevoke(null)}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleConfirmRevokeToken}>
              {t("settings.general.apiAccess.revoke.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Access request review */}
      <Dialog open={Boolean(selectedAccessRequest)} onOpenChange={(open) => !open && setSelectedAccessRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("settings.team.requests.modal.title")}</DialogTitle>
            <DialogDescription>{t("settings.team.requests.modal.description")}</DialogDescription>
          </DialogHeader>
          {selectedAccessRequest && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("settings.team.requests.modal.fields.name")}</span>
                <span>{selectedAccessRequest.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("settings.team.requests.modal.fields.email")}</span>
                <span>{selectedAccessRequest.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("settings.team.requests.modal.fields.role")}</span>
                <span>{t(`settings.team.roles.${selectedAccessRequest.role.toLowerCase()}`)}</span>
              </div>
              <div>
                <p className="font-medium text-sm">{t("settings.team.requests.modal.fields.message")}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedAccessRequest.message ?? t("settings.team.requests.modal.fields.messageEmpty")}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("settings.team.requests.modal.fields.requestedAt", { value: formatDateTime(selectedAccessRequest.requestedAt) })}
              </p>
            </div>
          )}
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={() => setSelectedAccessRequest(null)}>{t("common.cancel")}</Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => selectedAccessRequest && handleProcessAccessRequest(selectedAccessRequest.id)}>
                {t("settings.team.requests.actions.deny")}
              </Button>
              <Button onClick={() => selectedAccessRequest && handleProcessAccessRequest(selectedAccessRequest.id)}>
                {t("settings.team.requests.actions.approve")}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove device */}
      <AlertDialog open={Boolean(deviceToRemove)} onOpenChange={(open) => !open && setDeviceToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("settings.security.devices.remove.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("settings.security.devices.remove.description", { name: deviceToRemove?.name ?? "" })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeviceToRemove(null)}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleConfirmRemoveDevice}>
              {t("settings.security.devices.remove.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Template preview */}
      <Dialog open={Boolean(selectedTemplate)} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate ? t("settings.notifications.templates.modal.title", { name: t(selectedTemplate.nameKey) }) : ""}</DialogTitle>
            <DialogDescription>{t("settings.notifications.templates.modal.description")}</DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="space-y-1 text-sm">
                <p className="font-medium">{t("settings.notifications.templates.modal.channel")}</p>
                <p className="text-xs text-muted-foreground">{t(`settings.notifications.categories.${selectedTemplate.channel}`)}</p>
              </div>
              <div className="rounded-md border bg-muted/40 p-4">
                <pre className="whitespace-pre-wrap text-xs font-mono text-muted-foreground">
                  {t(selectedTemplate.previewKey)}
                </pre>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelectedTemplate(null)}>{t("common.close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Automation recipe detail */}
      <Dialog open={Boolean(activeRecipe)} onOpenChange={(open) => !open && setActiveRecipe(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeRecipe ? t("settings.integrations.automation.modal.title", { name: t(activeRecipe.nameKey) }) : ""}</DialogTitle>
            <DialogDescription>{t("settings.integrations.automation.modal.description")}</DialogDescription>
          </DialogHeader>
          {activeRecipe && (
            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <p className="font-medium">{t("settings.integrations.automation.modal.trigger")}</p>
                <p className="text-xs text-muted-foreground">{t(activeRecipe.triggerKey)}</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">{t("settings.integrations.automation.modal.action")}</p>
                <p className="text-xs text-muted-foreground">{t(activeRecipe.actionKey)}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{t("settings.integrations.automation.modal.statusLabel")}</p>
                  <p className="text-xs text-muted-foreground">{t("settings.integrations.automation.modal.statusHelper")}</p>
                </div>
                <Switch
                  checked={activeRecipe.status === "enabled"}
                  onCheckedChange={(checked) => handleAutomationToggle(activeRecipe.id, Boolean(checked))}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setActiveRecipe(null)}>{t("common.close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite members */}
      <Dialog open={isInviteModalOpen} onOpenChange={(open) => setInviteModalOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("settings.team.inviteModal.title")}</DialogTitle>
            <DialogDescription>{t("settings.team.inviteModal.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("settings.team.inviteModal.fields.emails")}</Label>
              <Textarea
                rows={4}
                value={inviteForm.emails}
                onChange={(e) => setInviteForm((prev) => ({ ...prev, emails: e.target.value }))}
                placeholder={t("settings.team.inviteModal.placeholders.emails")}
              />
              <p className="text-xs text-muted-foreground">{t("settings.team.inviteModal.hints.emails")}</p>
            </div>
            <div className="space-y-2">
              <Label>{t("settings.team.inviteModal.fields.role")}</Label>
              <Select value={inviteForm.role} onValueChange={(value) => setInviteForm((prev) => ({ ...prev, role: value as TeamMemberRole }))}>
                <SelectTrigger>
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
            </div>
            <div className="space-y-2">
              <Label>{t("settings.team.inviteModal.fields.message")}</Label>
              <Textarea
                rows={3}
                value={inviteForm.message}
                onChange={(e) => setInviteForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder={t("settings.team.inviteModal.placeholders.message")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteModalOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleInviteSubmit}>{t("settings.team.inviteModal.actions.send")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk invite */}
      <Dialog open={isBulkInviteModalOpen} onOpenChange={(open) => setBulkInviteModalOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("settings.team.bulkInvite.title")}</DialogTitle>
            <DialogDescription>{t("settings.team.bulkInvite.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("settings.team.bulkInvite.fields.csv")}</Label>
              <Textarea
                rows={6}
                value={bulkInviteText}
                onChange={(e) => setBulkInviteText(e.target.value)}
                placeholder={t("settings.team.bulkInvite.placeholders.csv")}
              />
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t("settings.team.bulkInvite.actions.downloadTemplate")}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkInviteModalOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleBulkInviteSubmit}>{t("settings.team.bulkInvite.actions.upload")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create custom role */}
      <Dialog open={isCreateRoleOpen} onOpenChange={(open) => {
        setCreateRoleOpen(open);
        if (!open) resetRoleForm();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("settings.team.rolesModal.title")}</DialogTitle>
            <DialogDescription>{t("settings.team.rolesModal.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("settings.team.rolesModal.fields.name")}</Label>
                <Input value={newRole.name} onChange={(e) => setNewRole((prev) => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>{t("settings.team.rolesModal.fields.description")}</Label>
                <Input value={newRole.description} onChange={(e) => setNewRole((prev) => ({ ...prev, description: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-3">
              <Label>{t("settings.team.rolesModal.permissions.title")}</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {permissionOptions.map(({ key, labelKey, descriptionKey, icon: Icon }) => (
                  <div key={key} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t(labelKey)}</p>
                        <p className="text-xs text-muted-foreground">{t(descriptionKey)}</p>
                      </div>
                    </div>
                    <Switch
                      checked={newRole.permissions[key]}
                      onCheckedChange={(checked) => handleRolePermissionToggle(key, Boolean(checked))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetRoleForm();
              setCreateRoleOpen(false);
            }}>{t("common.cancel")}</Button>
            <Button onClick={handleCreateRoleSubmit}>{t("settings.team.rolesModal.actions.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add domain */}
      <Dialog open={isAddDomainOpen} onOpenChange={(open) => setAddDomainOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("settings.general.domains.modal.title")}</DialogTitle>
            <DialogDescription>{t("settings.general.domains.modal.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("settings.general.domains.modal.fields.domain")}</Label>
              <Input value={newDomain.domain} onChange={(e) => setNewDomain((prev) => ({ ...prev, domain: e.target.value }))} placeholder="example.com" />
            </div>
            <div className="space-y-2">
              <Label>{t("settings.general.domains.modal.fields.type")}</Label>
              <Select value={newDomain.type} onValueChange={(value) => setNewDomain((prev) => ({ ...prev, type: value as DomainRuleType }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">{t("settings.general.domains.types.primary")}</SelectItem>
                  <SelectItem value="allowed">{t("settings.general.domains.types.allowed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDomainOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleAddDomainRule}>{t("settings.general.domains.modal.actions.add")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add IP rule */}
      <Dialog open={isAddIpOpen} onOpenChange={(open) => setAddIpOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("settings.security.ip.modal.title")}</DialogTitle>
            <DialogDescription>{t("settings.security.ip.modal.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>{t("settings.security.ip.modal.fields.label")}</Label>
              <Input value={newIpRule.label} onChange={(e) => setNewIpRule((prev) => ({ ...prev, label: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>{t("settings.security.ip.modal.fields.cidr")}</Label>
              <Input value={newIpRule.cidr} onChange={(e) => setNewIpRule((prev) => ({ ...prev, cidr: e.target.value }))} placeholder="203.0.113.0/24" />
            </div>
            <div className="space-y-2">
              <Label>{t("settings.security.ip.modal.fields.location")}</Label>
              <Input value={newIpRule.location} onChange={(e) => setNewIpRule((prev) => ({ ...prev, location: e.target.value }))} placeholder="Tokyo, JP" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddIpOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleAddIpRule}>{t("settings.security.ip.modal.actions.add")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add payment method */}
      <Dialog open={isPaymentMethodModalOpen} onOpenChange={(open) => setPaymentMethodModalOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("settings.billing.paymentMethods.modal.title")}</DialogTitle>
            <DialogDescription>{t("settings.billing.paymentMethods.modal.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("settings.billing.paymentMethods.modal.fields.brand")}</Label>
              <Select value={paymentForm.brand} onValueChange={(value) => setPaymentForm((prev) => ({ ...prev, brand: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visa">Visa</SelectItem>
                  <SelectItem value="Mastercard">Mastercard</SelectItem>
                  <SelectItem value="American Express">American Express</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("settings.billing.paymentMethods.modal.fields.last4")}</Label>
              <Input value={paymentForm.last4} maxLength={4} onChange={(e) => setPaymentForm((prev) => ({ ...prev, last4: e.target.value.replace(/[^0-9]/g, "") }))} />
            </div>
            <div className="space-y-2">
              <Label>{t("settings.billing.paymentMethods.modal.fields.expiry")}</Label>
              <Input value={paymentForm.expiry} onChange={(e) => setPaymentForm((prev) => ({ ...prev, expiry: e.target.value }))} placeholder="MM/YY" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">{t("settings.billing.paymentMethods.modal.fields.setDefault")}</p>
                <p className="text-xs text-muted-foreground">{t("settings.billing.paymentMethods.modal.fields.setDefaultHelper")}</p>
              </div>
              <Switch checked={paymentForm.setAsDefault} onCheckedChange={(checked) => setPaymentForm((prev) => ({ ...prev, setAsDefault: Boolean(checked) }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentMethodModalOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleAddPaymentMethod}>{t("settings.billing.paymentMethods.modal.actions.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Integration configuration */}
      <Dialog open={Boolean(activeIntegration)} onOpenChange={(open) => {
        if (!open) {
          setActiveIntegrationId(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{activeIntegration ? t("settings.integrations.modal.title", { name: t(activeIntegration.nameKey) }) : ""}</DialogTitle>
            <DialogDescription>{activeIntegration ? t("settings.integrations.modal.description", { name: t(activeIntegration.nameKey) }) : ""}</DialogDescription>
          </DialogHeader>
          {activeIntegration && activeIntegrationSettings && (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">{t("settings.integrations.modal.sync.heading")}</p>
                <p className="text-xs text-muted-foreground">{t("settings.integrations.modal.sync.description")}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{t("settings.integrations.modal.sync.events")}</p>
                  <p className="text-xs text-muted-foreground">{t("settings.integrations.modal.sync.eventsHelper")}</p>
                </div>
                <Switch
                  checked={activeIntegrationSettings.syncEvents}
                  onCheckedChange={(checked) => handleIntegrationSettingToggle(activeIntegration.id, "syncEvents", Boolean(checked))}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{t("settings.integrations.modal.sync.reminders")}</p>
                  <p className="text-xs text-muted-foreground">{t("settings.integrations.modal.sync.remindersHelper")}</p>
                </div>
                <Switch
                  checked={activeIntegrationSettings.reminders}
                  onCheckedChange={(checked) => handleIntegrationSettingToggle(activeIntegration.id, "reminders", Boolean(checked))}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{t("settings.integrations.modal.sync.postSummary")}</p>
                  <p className="text-xs text-muted-foreground">{t("settings.integrations.modal.sync.postSummaryHelper")}</p>
                </div>
                <Switch
                  checked={activeIntegrationSettings.postSummary}
                  onCheckedChange={(checked) => handleIntegrationSettingToggle(activeIntegration.id, "postSummary", Boolean(checked))}
                />
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{t("settings.integrations.modal.sync.alert")}</AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setActiveIntegrationId(null)}>{t("common.close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit event detail */}
      <Dialog open={Boolean(selectedAuditEvent)} onOpenChange={(open) => !open && setSelectedAuditEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedAuditEvent ? t("settings.security.audit.modal.title") : ""}</DialogTitle>
            <DialogDescription>{selectedAuditEvent ? t("settings.security.audit.modal.description") : ""}</DialogDescription>
          </DialogHeader>
          {selectedAuditEvent && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("settings.security.audit.modal.fields.actor")}</span>
                <span>{selectedAuditEvent.actor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("settings.security.audit.modal.fields.action")}</span>
                <span>{t(selectedAuditEvent.actionKey)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("settings.security.audit.modal.fields.target")}</span>
                <span>{selectedAuditEvent.target}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("settings.security.audit.modal.fields.ip")}</span>
                <span>{selectedAuditEvent.ipAddress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("settings.security.audit.modal.fields.time")}</span>
                <span>{formatDateTime(selectedAuditEvent.createdAt)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelectedAuditEvent(null)}>{t("common.close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice detail */}
      <Dialog open={Boolean(selectedInvoice)} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedInvoice ? t("settings.billing.invoices.modal.title", { number: selectedInvoice.number }) : ""}</DialogTitle>
            <DialogDescription>{t("settings.billing.invoices.modal.description")}</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("settings.billing.invoices.table.period")}</span>
                <span>{selectedInvoice.period}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("settings.billing.invoices.table.amount")}</span>
                <span>{selectedInvoice.amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("settings.billing.invoices.modal.fields.issuedAt")}</span>
                <span>{selectedInvoice.issuedAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("settings.billing.invoices.modal.fields.dueAt")}</span>
                <span>{selectedInvoice.dueAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={selectedInvoice.status === "paid" ? "default" : "secondary"}>{t(`settings.billing.invoices.statuses.${selectedInvoice.status}`)}</Badge>
                <span className="text-xs text-muted-foreground">{t("settings.billing.invoices.modal.fields.statusLabel")}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedInvoice(null)}>{t("common.close")}</Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              {t("settings.billing.invoices.actions.download")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit member */}
      <Dialog open={Boolean(editingMember)} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="w-[900px] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>{t("settings.team.editMemberTitle")}</DialogTitle>
            <DialogDescription>{t("settings.team.editMemberDescription")}</DialogDescription>
          </DialogHeader>

          {editingMember && (
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-sm font-medium">{editingMember.name}</p>
                <p className="text-xs text-muted-foreground">{editingMember.email}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("settings.team.dialog.fields.role")}</Label>
                  <Select
                    value={editingMember.role}
                    onValueChange={(value) =>
                      setEditingMember((prev) => (prev ? { ...prev, role: value as TeamMemberRole } : prev))
                    }
                  >
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label>{t("settings.team.dialog.fields.status")}</Label>
                  <Select
                    value={editingMember.status}
                    onValueChange={(value) =>
                      setEditingMember((prev) => (prev ? { ...prev, status: value as TeamMemberStatus } : prev))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t("settings.team.statuses.active")}</SelectItem>
                      <SelectItem value="pending">{t("settings.team.statuses.pending")}</SelectItem>
                      <SelectItem value="disabled">{t("settings.team.statuses.disabled")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>{t("settings.team.dialog.permissions.title")}</Label>
                  <p className="text-xs text-muted-foreground">{t("settings.team.dialog.permissions.description")}</p>
                </div>
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                  {permissionOptions.map(({ key, labelKey, descriptionKey, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t(labelKey)}</p>
                          <p className="text-xs text-muted-foreground">{t(descriptionKey)}</p>
                        </div>
                      </div>
                      <Switch
                        checked={editingMember.permissions[key]}
                        onCheckedChange={(checked) =>
                          setEditingMember((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  permissions: {
                                    ...prev.permissions,
                                    [key]: Boolean(checked),
                                  },
                                }
                              : prev
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("settings.team.dialog.fields.notifications")}</Label>
                  <Select
                    value={editingMember.notificationPreference}
                    onValueChange={(value) =>
                      setEditingMember((prev) => (prev ? { ...prev, notificationPreference: value as NotificationPreference } : prev))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(option.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{t("settings.team.dialog.enforcement.label")}</p>
                    <p className="text-xs text-muted-foreground">{t("settings.team.dialog.enforcement.description")}</p>
                  </div>
                  <Switch
                    checked={editingMember.requiresTwoFactor}
                    onCheckedChange={(checked) =>
                      setEditingMember((prev) => (prev ? { ...prev, requiresTwoFactor: Boolean(checked) } : prev))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMember(null)}>{t("common.cancel")}</Button>
            <Button onClick={() => {
              if (!editingMember) return;
              setTeamMembers((prev) => prev.map((m) => (m.id === editingMember.id ? editingMember : m)));
              setEditingMember(null);
            }}>{t("settings.actions.saveChanges")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete member */}
      <Dialog open={Boolean(confirmDeleteMemberId)} onOpenChange={(open) => !open && setConfirmDeleteMemberId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("settings.team.deleteConfirmTitle")}</DialogTitle>
            <DialogDescription>{t("settings.team.deleteConfirmDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteMemberId(null)}>{t("common.cancel")}</Button>
            <Button onClick={() => {
              if (!confirmDeleteMemberId) return;
              setTeamMembers((prev) => prev.filter((m) => m.id !== confirmDeleteMemberId));
              setConfirmDeleteMemberId(null);
            }} className="text-red-600">{t("common.delete")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
