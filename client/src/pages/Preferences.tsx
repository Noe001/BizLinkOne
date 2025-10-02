import { useMemo, useState } from "react";
import { useTranslation } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import type { LucideIcon } from "lucide-react";
import {
  Accessibility,
  AlertCircle,
  AppWindow,
  BadgeCheck,
  Bell,
  BellRing,
  Clock,
  Columns,
  Eye,
  Globe,
  Keyboard,
  Languages,
  Monitor,
  Moon,
  Palette,
  Pencil,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Sun,
  Type,
  Undo2,
  Volume2,
  Zap,
} from "lucide-react";

const HOURS = Array.from({ length: 24 }, (_, hour) => `${hour.toString().padStart(2, "0")}:00`);

const ACCENT_OPTIONS = [
  "blue",
  "green",
  "purple",
  "red",
  "orange",
  "yellow",
  "pink",
  "indigo",
] as const;

const ACCENT_COLOR_CLASSES: Record<(typeof ACCENT_OPTIONS)[number], string> = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  pink: "bg-pink-500",
  indigo: "bg-indigo-500",
};

type AppearanceState = {
  theme: "light" | "dark" | "system";
  accentColor: (typeof ACCENT_OPTIONS)[number];
  fontSize: "small" | "medium" | "large";
  sidebarCollapsed: boolean;
  compactMode: boolean;
  showAvatars: boolean;
  animationsEnabled: boolean;
};

type NotificationsState = {
  soundEnabled: boolean;
  soundVolume: number;
  desktopNotifications: boolean;
  emailDigest: "never" | "daily" | "weekly" | "monthly";
  quietHours: boolean;
  quietStart: string;
  quietEnd: string;
  importantOnly: boolean;
  inAppBadges: boolean;
  mobilePush: boolean;
};

type AccessibilityState = {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  textScale: "small" | "medium" | "large";
  focusOutline: number;
};

type GeneralState = {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  firstDayOfWeek: "sunday" | "monday";
  autoStart: boolean;
  confirmBeforeExit: boolean;
  betaFeatures: boolean;
  analyticsConsent: boolean;
};

type ShortcutCategory = "navigation" | "communication" | "productivity";

type ShortcutItem = {
  id: string;
  labelKey: string;
  descriptionKey: string;
  category: ShortcutCategory;
  keys: string[];
};

const initialAppearance: AppearanceState = {
  theme: "system",
  accentColor: "blue",
  fontSize: "medium",
  sidebarCollapsed: false,
  compactMode: false,
  showAvatars: true,
  animationsEnabled: true,
};

const initialNotifications: NotificationsState = {
  soundEnabled: true,
  soundVolume: 60,
  desktopNotifications: true,
  emailDigest: "daily",
  quietHours: false,
  quietStart: "22:00",
  quietEnd: "08:00",
  importantOnly: false,
  inAppBadges: true,
  mobilePush: false,
};

const initialAccessibility: AccessibilityState = {
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  focusIndicators: true,
  textScale: "medium",
  focusOutline: 2,
};

const initialGeneral: GeneralState = {
  language: "en",
  timezone: "America/New_York",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12h",
  firstDayOfWeek: "monday",
  autoStart: true,
  confirmBeforeExit: true,
  betaFeatures: false,
  analyticsConsent: true,
};

const defaultShortcuts: ShortcutItem[] = [
  {
    id: "command-palette",
    labelKey: "preferences.shortcuts.items.commandPalette.label",
    descriptionKey: "preferences.shortcuts.items.commandPalette.description",
    category: "navigation",
    keys: ["Ctrl", "K"],
  },
  {
    id: "quick-search",
    labelKey: "preferences.shortcuts.items.quickSearch.label",
    descriptionKey: "preferences.shortcuts.items.quickSearch.description",
    category: "navigation",
    keys: ["Ctrl", "F"],
  },
  {
    id: "new-message",
    labelKey: "preferences.shortcuts.items.newMessage.label",
    descriptionKey: "preferences.shortcuts.items.newMessage.description",
    category: "communication",
    keys: ["Ctrl", "Shift", "M"],
  },
  {
    id: "create-task",
    labelKey: "preferences.shortcuts.items.createTask.label",
    descriptionKey: "preferences.shortcuts.items.createTask.description",
    category: "productivity",
    keys: ["Ctrl", "Shift", "T"],
  },
  {
    id: "toggle-theme",
    labelKey: "preferences.shortcuts.items.toggleTheme.label",
    descriptionKey: "preferences.shortcuts.items.toggleTheme.description",
    category: "productivity",
    keys: ["Ctrl", "Shift", "L"],
  },
  {
    id: "focus-notifications",
    labelKey: "preferences.shortcuts.items.focusNotifications.label",
    descriptionKey: "preferences.shortcuts.items.focusNotifications.description",
    category: "communication",
    keys: ["Ctrl", "Shift", "N"],
  },
];

const categoryVariants: Record<ShortcutCategory, "default" | "secondary" | "outline"> = {
  navigation: "default",
  communication: "secondary",
  productivity: "outline",
};

const formatShortcut = (keys: string[]) => keys.join(" + ");

const cloneShortcuts = () => defaultShortcuts.map((item) => ({ ...item, keys: [...item.keys] }));

type ThemeOption = {
  value: AppearanceState["theme"];
  icon: LucideIcon;
};

const themeOptions: ThemeOption[] = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
];

export default function Preferences() {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("appearance");
  const [appearance, setAppearance] = useState<AppearanceState>(initialAppearance);
  const [notifications, setNotifications] = useState<NotificationsState>(initialNotifications);
  const [accessibility, setAccessibility] = useState<AccessibilityState>(initialAccessibility);
  const [general, setGeneral] = useState<GeneralState>(initialGeneral);
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>(() => cloneShortcuts());
  const [editingShortcut, setEditingShortcut] = useState<ShortcutItem | null>(null);
  const [shortcutInput, setShortcutInput] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isResetDialogOpen, setResetDialogOpen] = useState(false);
  const [isCacheDialogOpen, setCacheDialogOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const quietHourOptions = useMemo(() => HOURS, []);
  const formattedLastSaved = useMemo(() => {
    if (!lastSavedAt) return null;
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(lastSavedAt);
  }, [lastSavedAt]);

  const markDirty = () => {
    if (!isDirty) {
      setIsDirty(true);
    }
  };

  const handleAppearanceChange = <K extends keyof AppearanceState>(field: K, value: AppearanceState[K]) => {
    setAppearance((prev) => ({ ...prev, [field]: value }));
    markDirty();
  };

  const handleNotificationChange = <K extends keyof NotificationsState>(field: K, value: NotificationsState[K]) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
    markDirty();
  };

  const handleAccessibilityChange = <K extends keyof AccessibilityState>(field: K, value: AccessibilityState[K]) => {
    setAccessibility((prev) => ({ ...prev, [field]: value }));
    markDirty();
  };

  const handleGeneralChange = <K extends keyof GeneralState>(field: K, value: GeneralState[K]) => {
    setGeneral((prev) => ({ ...prev, [field]: value }));
    markDirty();
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    setIsDirty(false);
    const now = new Date();
    setLastSavedAt(now);
    toast({
      title: t("preferences.toast.saved.title"),
      description: t("preferences.toast.saved.description"),
    });
  };

  const handleResetDefaults = () => {
    setAppearance(initialAppearance);
    setNotifications(initialNotifications);
    setAccessibility(initialAccessibility);
    setGeneral(initialGeneral);
    setShortcuts(cloneShortcuts());
    setResetDialogOpen(false);
    markDirty();
    toast({
      title: t("preferences.toast.reset.title"),
      description: t("preferences.toast.reset.description"),
    });
  };

  const handleShortcutEdit = (shortcut: ShortcutItem) => {
    setEditingShortcut(shortcut);
    setShortcutInput(formatShortcut(shortcut.keys));
  };

  const handleShortcutSave = () => {
    if (!editingShortcut) return;
    const keys = shortcutInput
      .split("+")
      .map((key) => key.trim())
      .filter(Boolean);

    if (keys.length === 0) {
      return;
    }

    setShortcuts((prev) =>
      prev.map((item) => (item.id === editingShortcut.id ? { ...item, keys } : item))
    );
    setEditingShortcut(null);
    setShortcutInput("");
    markDirty();
  };

  const handleShortcutReset = () => {
    setShortcuts(cloneShortcuts());
    markDirty();
  };

  const handleSendTestNotification = () => {
    toast({
      title: t("preferences.toast.notification.title"),
      description: t("preferences.toast.notification.description"),
    });
  };

  const handleClearCache = () => {
    setCacheDialogOpen(false);
    toast({
      title: t("preferences.toast.cacheCleared.title"),
      description: t("preferences.toast.cacheCleared.description"),
    });
  };

  const accentClass = ACCENT_COLOR_CLASSES[appearance.accentColor];

  return (
    <TooltipProvider>
      <div className="space-y-6 p-6" data-testid="page-preferences">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground">{t("preferences.header.description")}</p>
            {formattedLastSaved && (
              <p className="text-xs text-muted-foreground">
                {t("preferences.header.lastSaved", { value: formattedLastSaved })}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => setResetDialogOpen(true)}
            >
              <RefreshCw className="h-4 w-4" />
              {t("preferences.actions.reset")}
            </Button>
            <Button
              type="button"
              className="gap-2"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? t("preferences.actions.saving") : t("preferences.actions.save")}
            </Button>
          </div>
        </div>

        {isDirty && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t("preferences.alert.unsaved", { action: t("preferences.actions.save") })}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full gap-2 md:grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              {t("preferences.tabs.appearance")}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              {t("preferences.tabs.notifications")}
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Accessibility className="h-4 w-4" />
              {t("preferences.tabs.accessibility")}
            </TabsTrigger>
            <TabsTrigger value="shortcuts" className="flex items-center gap-2">
              <Keyboard className="h-4 w-4" />
              {t("preferences.tabs.shortcuts")}
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t("preferences.tabs.general")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  {t("preferences.appearance.title")}
                </CardTitle>
                <CardDescription>{t("preferences.appearance.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>{t("preferences.appearance.theme.label")}</Label>
                  <div className="grid gap-4 md:grid-cols-3">
                    {themeOptions.map((option) => {
                      const Icon = option.icon;
                      const isActive = appearance.theme === option.value;
                      return (
                        <Button
                          key={option.value}
                          type="button"
                          variant="outline"
                          className={`h-auto flex-col items-start gap-3 rounded-xl border p-4 text-left transition ${
                            isActive ? "border-primary ring-2 ring-offset-2" : "hover:border-primary/50"
                          }`}
                          onClick={() => handleAppearanceChange("theme", option.value)}
                        >
                          <Icon className="h-6 w-6" />
                          <div>
                            <p className="font-medium">
                              {t(`preferences.appearance.theme.options.${option.value}`)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t(`preferences.appearance.theme.descriptions.${option.value}`)}
                            </p>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {t("preferences.appearance.accent.label")}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t("preferences.appearance.accent.helper")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ACCENT_OPTIONS.map((color) => (
                      <Tooltip key={color}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            aria-label={t(`preferences.appearance.accent.colors.${color}`)}
                            className={`h-10 w-10 rounded-full transition ${ACCENT_COLOR_CLASSES[color]} ${
                              appearance.accentColor === color
                                ? "ring-2 ring-offset-2 ring-primary scale-105"
                                : "hover:scale-105"
                            }`}
                            onClick={() => handleAppearanceChange("accentColor", color)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {t(`preferences.appearance.accent.colors.${color}`)}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      {t("preferences.appearance.fontSize.label")}
                    </Label>
                    <Select
                      value={appearance.fontSize}
                      onValueChange={(value) => handleAppearanceChange("fontSize", value as AppearanceState["fontSize"])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">
                          {t("preferences.appearance.fontSize.options.small")}
                        </SelectItem>
                        <SelectItem value="medium">
                          {t("preferences.appearance.fontSize.options.medium")}
                        </SelectItem>
                        <SelectItem value="large">
                          {t("preferences.appearance.fontSize.options.large")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.appearance.fontSize.description")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Columns className="h-4 w-4" />
                      {t("preferences.appearance.density.sidebar.label")}
                    </Label>
                    <Switch
                      checked={appearance.sidebarCollapsed}
                      onCheckedChange={(checked) => handleAppearanceChange("sidebarCollapsed", checked)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.appearance.density.sidebar.description")}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {t("preferences.appearance.density.compact.label")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("preferences.appearance.density.compact.description")}
                      </p>
                    </div>
                    <Switch
                      checked={appearance.compactMode}
                      onCheckedChange={(checked) => handleAppearanceChange("compactMode", checked)}
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {t("preferences.appearance.density.avatars.label")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("preferences.appearance.density.avatars.description")}
                      </p>
                    </div>
                    <Switch
                      checked={appearance.showAvatars}
                      onCheckedChange={(checked) => handleAppearanceChange("showAvatars", checked)}
                    />
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {t("preferences.appearance.density.animations.label")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.appearance.density.animations.description")}
                    </p>
                  </div>
                  <Switch
                    checked={appearance.animationsEnabled}
                    onCheckedChange={(checked) => handleAppearanceChange("animationsEnabled", checked)}
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <AppWindow className="h-4 w-4" />
                  {t("preferences.actions.preview")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {t("preferences.notifications.title")}
                </CardTitle>
                <CardDescription>{t("preferences.notifications.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {t("preferences.notifications.sound.label")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.notifications.sound.description")}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.soundEnabled}
                    onCheckedChange={(checked) => handleNotificationChange("soundEnabled", checked)}
                  />
                </div>

                {notifications.soundEnabled && (
                  <div className="space-y-2 rounded-lg border p-4">
                    <Label className="flex items-center gap-2 text-sm">
                      <Volume2 className="h-4 w-4" />
                      {t("preferences.notifications.sound.volumeLabel", {
                        value: notifications.soundVolume,
                      })}
                    </Label>
                    <Slider
                      value={[notifications.soundVolume]}
                      max={100}
                      step={5}
                      onValueChange={(value) => handleNotificationChange("soundVolume", value[0])}
                    />
                  </div>
                )}

                <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {t("preferences.notifications.desktop.label")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.notifications.desktop.description")}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.desktopNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("desktopNotifications", checked)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("preferences.notifications.emailDigest.label")}</Label>
                    <Select
                      value={notifications.emailDigest}
                      onValueChange={(value) =>
                        handleNotificationChange("emailDigest", value as NotificationsState["emailDigest"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">
                          {t("preferences.notifications.emailDigest.options.never")}
                        </SelectItem>
                        <SelectItem value="daily">
                          {t("preferences.notifications.emailDigest.options.daily")}
                        </SelectItem>
                        <SelectItem value="weekly">
                          {t("preferences.notifications.emailDigest.options.weekly")}
                        </SelectItem>
                        <SelectItem value="monthly">
                          {t("preferences.notifications.emailDigest.options.monthly")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.notifications.emailDigest.description")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("preferences.notifications.quietHours.label")}</Label>
                    <Switch
                      checked={notifications.quietHours}
                      onCheckedChange={(checked) => handleNotificationChange("quietHours", checked)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.notifications.quietHours.description")}
                    </p>
                  </div>
                </div>

                {notifications.quietHours && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>{t("preferences.notifications.quietHours.start")}</Label>
                      <Select
                        value={notifications.quietStart}
                        onValueChange={(value) => handleNotificationChange("quietStart", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {quietHourOptions.map((hour) => (
                            <SelectItem key={hour} value={hour}>
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("preferences.notifications.quietHours.end")}</Label>
                      <Select
                        value={notifications.quietEnd}
                        onValueChange={(value) => handleNotificationChange("quietEnd", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {quietHourOptions.map((hour) => (
                            <SelectItem key={hour} value={hour}>
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="md:col-span-2 text-xs text-muted-foreground">
                      {t("preferences.notifications.quietHoursActive.helper", {
                        start: notifications.quietStart,
                        end: notifications.quietEnd,
                      })}
                    </p>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {t("preferences.notifications.inAppBadges.label")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("preferences.notifications.inAppBadges.description")}
                      </p>
                    </div>
                    <Switch
                      checked={notifications.inAppBadges}
                      onCheckedChange={(checked) => handleNotificationChange("inAppBadges", checked)}
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {t("preferences.notifications.mobilePush.label")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("preferences.notifications.mobilePush.description")}
                      </p>
                    </div>
                    <Switch
                      checked={notifications.mobilePush}
                      onCheckedChange={(checked) => handleNotificationChange("mobilePush", checked)}
                    />
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {t("preferences.notifications.importantOnly.label")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.notifications.importantOnly.description")}
                    </p>
                  </div>
                  <Switch
                    checked={notifications.importantOnly}
                    onCheckedChange={(checked) => handleNotificationChange("importantOnly", checked)}
                  />
                </div>

                <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {t("preferences.notifications.test.description")}
                    </p>
                  </div>
                  <Button type="button" variant="outline" className="gap-2" onClick={handleSendTestNotification}>
                    <Zap className="h-4 w-4" />
                    {t("preferences.actions.testNotification")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {t("preferences.accessibility.title")}
                </CardTitle>
                <CardDescription>{t("preferences.accessibility.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {t("preferences.accessibility.highContrast.label")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.accessibility.highContrast.description")}
                    </p>
                  </div>
                  <Switch
                    checked={accessibility.highContrast}
                    onCheckedChange={(checked) => handleAccessibilityChange("highContrast", checked)}
                  />
                </div>

                <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {t("preferences.accessibility.reducedMotion.label")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.accessibility.reducedMotion.description")}
                    </p>
                  </div>
                  <Switch
                    checked={accessibility.reducedMotion}
                    onCheckedChange={(checked) => handleAccessibilityChange("reducedMotion", checked)}
                  />
                </div>

                <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {t("preferences.accessibility.screenReader.label")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.accessibility.screenReader.description")}
                    </p>
                  </div>
                  <Switch
                    checked={accessibility.screenReader}
                    onCheckedChange={(checked) => handleAccessibilityChange("screenReader", checked)}
                  />
                </div>

                <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {t("preferences.accessibility.keyboardNavigation.label")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.accessibility.keyboardNavigation.description")}
                    </p>
                  </div>
                  <Switch
                    checked={accessibility.keyboardNavigation}
                    onCheckedChange={(checked) => handleAccessibilityChange("keyboardNavigation", checked)}
                  />
                </div>

                <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {t("preferences.accessibility.focusIndicators.label")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.accessibility.focusIndicators.description")}
                    </p>
                  </div>
                  <Switch
                    checked={accessibility.focusIndicators}
                    onCheckedChange={(checked) => handleAccessibilityChange("focusIndicators", checked)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      {t("preferences.accessibility.textScale.label")}
                    </Label>
                    <Select
                      value={accessibility.textScale}
                      onValueChange={(value) =>
                        handleAccessibilityChange("textScale", value as AccessibilityState["textScale"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">
                          {t("preferences.accessibility.textScale.options.small")}
                        </SelectItem>
                        <SelectItem value="medium">
                          {t("preferences.accessibility.textScale.options.medium")}
                        </SelectItem>
                        <SelectItem value="large">
                          {t("preferences.accessibility.textScale.options.large")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      {t("preferences.accessibility.focusOutline.label")}
                    </Label>
                    <Slider
                      value={[accessibility.focusOutline]}
                      min={1}
                      max={4}
                      step={1}
                      onValueChange={(value) => handleAccessibilityChange("focusOutline", value[0])}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.accessibility.focusOutline.helper", {
                        value: accessibility.focusOutline,
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shortcuts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5" />
                  {t("preferences.shortcuts.title")}
                </CardTitle>
                <CardDescription>{t("preferences.shortcuts.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button type="button" variant="outline" className="gap-2" onClick={handleShortcutReset}>
                    <Undo2 className="h-4 w-4" />
                    {t("preferences.shortcuts.reset")}
                  </Button>
                </div>

                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("preferences.shortcuts.table.headers.action")}</TableHead>
                        <TableHead>{t("preferences.shortcuts.table.headers.shortcut")}</TableHead>
                        <TableHead>{t("preferences.shortcuts.table.headers.category")}</TableHead>
                        <TableHead className="w-[120px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shortcuts.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <p className="font-medium">{t(item.labelKey)}</p>
                            <p className="text-xs text-muted-foreground">{t(item.descriptionKey)}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{formatShortcut(item.keys)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={categoryVariants[item.category]}>
                              {t(`preferences.shortcuts.categories.${item.category}`)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="gap-2"
                              onClick={() => handleShortcutEdit(item)}
                            >
                              <Pencil className="h-4 w-4" />
                              {t("preferences.actions.editShortcut")}
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

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t("preferences.general.title")}
                </CardTitle>
                <CardDescription>{t("preferences.general.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("preferences.general.language.label")}</Label>
                    <Select value={general.language} onValueChange={(value) => handleGeneralChange("language", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">{t("preferences.general.language.options.en")}</SelectItem>
                        <SelectItem value="ja">{t("preferences.general.language.options.ja")}</SelectItem>
                        <SelectItem value="es">{t("preferences.general.language.options.es")}</SelectItem>
                        <SelectItem value="fr">{t("preferences.general.language.options.fr")}</SelectItem>
                        <SelectItem value="de">{t("preferences.general.language.options.de")}</SelectItem>
                        <SelectItem value="ko">{t("preferences.general.language.options.ko")}</SelectItem>
                        <SelectItem value="zh">{t("preferences.general.language.options.zh")}</SelectItem>
                        <SelectItem value="pt">{t("preferences.general.language.options.pt")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.general.language.description")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("preferences.general.timezone.label")}</Label>
                    <Select value={general.timezone} onValueChange={(value) => handleGeneralChange("timezone", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">
                          {t("preferences.general.timezone.options.et")}
                        </SelectItem>
                        <SelectItem value="America/Chicago">
                          {t("preferences.general.timezone.options.ct")}
                        </SelectItem>
                        <SelectItem value="America/Denver">
                          {t("preferences.general.timezone.options.mt")}
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          {t("preferences.general.timezone.options.pt")}
                        </SelectItem>
                        <SelectItem value="Europe/London">
                          {t("preferences.general.timezone.options.gmt")}
                        </SelectItem>
                        <SelectItem value="Europe/Paris">
                          {t("preferences.general.timezone.options.cet")}
                        </SelectItem>
                        <SelectItem value="Asia/Tokyo">
                          {t("preferences.general.timezone.options.jst")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.general.timezone.description")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("preferences.general.dateFormat.label")}</Label>
                    <Select value={general.dateFormat} onValueChange={(value) => handleGeneralChange("dateFormat", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">
                          {t("preferences.general.dateFormat.options.us")}
                        </SelectItem>
                        <SelectItem value="DD/MM/YYYY">
                          {t("preferences.general.dateFormat.options.intl")}
                        </SelectItem>
                        <SelectItem value="YYYY-MM-DD">
                          {t("preferences.general.dateFormat.options.iso")}
                        </SelectItem>
                        <SelectItem value="DD MMM YYYY">
                          {t("preferences.general.dateFormat.options.written")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {t("preferences.general.timeFormat.label")}
                    </Label>
                    <Select value={general.timeFormat} onValueChange={(value) => handleGeneralChange("timeFormat", value as GeneralState["timeFormat"])}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">
                          {t("preferences.general.timeFormat.options['12h']")}
                        </SelectItem>
                        <SelectItem value="24h">
                          {t("preferences.general.timeFormat.options['24h']")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("preferences.general.firstDay.label")}</Label>
                    <Select
                      value={general.firstDayOfWeek}
                      onValueChange={(value) =>
                        handleGeneralChange("firstDayOfWeek", value as GeneralState["firstDayOfWeek"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunday">
                          {t("preferences.general.firstDay.options.sunday")}
                        </SelectItem>
                        <SelectItem value="monday">
                          {t("preferences.general.firstDay.options.monday")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {t("preferences.general.autoStart.label")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("preferences.general.autoStart.description")}
                      </p>
                    </div>
                    <Switch
                      checked={general.autoStart}
                      onCheckedChange={(checked) => handleGeneralChange("autoStart", checked)}
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {t("preferences.general.confirmExit.label")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("preferences.general.confirmExit.description")}
                      </p>
                    </div>
                    <Switch
                      checked={general.confirmBeforeExit}
                      onCheckedChange={(checked) => handleGeneralChange("confirmBeforeExit", checked)}
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {t("preferences.general.betaFeatures.label")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("preferences.general.betaFeatures.description")}
                      </p>
                    </div>
                    <Switch
                      checked={general.betaFeatures}
                      onCheckedChange={(checked) => handleGeneralChange("betaFeatures", checked)}
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4 rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {t("preferences.general.analytics.label")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("preferences.general.analytics.description")}
                      </p>
                    </div>
                    <Switch
                      checked={general.analyticsConsent}
                      onCheckedChange={(checked) => handleGeneralChange("analyticsConsent", checked)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {t("preferences.general.actions.cacheDescription")}
                    </p>
                  </div>
                  <Button type="button" variant="outline" className="gap-2" onClick={() => setCacheDialogOpen(true)}>
                    <RefreshCw className="h-4 w-4" />
                    {t("preferences.general.actions.clearCache")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("preferences.dialogs.preview.title")}</DialogTitle>
            <DialogDescription>{t("preferences.dialogs.preview.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card className="border shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4" />
                  {t("preferences.appearance.preview.sampleTitle")}
                </CardTitle>
                <CardDescription>
                  {t("preferences.appearance.preview.sampleDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-white ${accentClass}`}>
                    BL
                  </span>
                  <div>
                    <p className="font-medium">{t("preferences.appearance.preview.cardTitle")}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.appearance.preview.cardDescription")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {t("preferences.appearance.preview.toggleLabel")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("preferences.appearance.preview.toggleDescription")}
                    </p>
                  </div>
                  <Switch checked onCheckedChange={() => undefined} disabled />
                </div>
                <Button type="button" className="gap-2" disabled>
                  <BellRing className="h-4 w-4" />
                  {t("preferences.appearance.preview.button")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editingShortcut)}
        onOpenChange={(open) => {
          if (!open) {
            setEditingShortcut(null);
            setShortcutInput("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("preferences.shortcuts.dialog.title")}</DialogTitle>
            <DialogDescription>{t("preferences.shortcuts.dialog.description")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="shortcut-input">{t("preferences.shortcuts.dialog.helper")}</Label>
            <Input
              id="shortcut-input"
              value={shortcutInput}
              onChange={(event) => setShortcutInput(event.target.value)}
              placeholder="Ctrl + Shift + P"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditingShortcut(null)}>
              {t("preferences.actions.cancel")}
            </Button>
            <Button type="button" onClick={handleShortcutSave}>
              {t("preferences.dialogs.shortcut.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isResetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("preferences.dialogs.reset.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("preferences.dialogs.reset.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("preferences.actions.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetDefaults}>
              {t("preferences.dialogs.reset.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isCacheDialogOpen} onOpenChange={setCacheDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("preferences.dialogs.cache.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("preferences.dialogs.cache.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("preferences.actions.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearCache}>
              {t("preferences.dialogs.cache.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
