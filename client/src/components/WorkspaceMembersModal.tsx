import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  MoreHorizontal,
  Trash2,
  Crown,
  Search,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import { getTagColor } from "@/utils/tagColors";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkspaceMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: WorkspaceMember[];
  pendingInvites: PendingInvite[];
  onInviteMember: (email: string, role: MemberRole) => void;
  onUpdateMemberRole: (memberId: string, role: MemberRole) => void;
  onRemoveMember: (memberId: string) => void;
  onCancelInvite: (inviteId: string) => void;
  onResendInvite: (inviteId: string) => void;
  currentUserId: string;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: MemberRole;
  joinedAt: Date;
  isOwner?: boolean;
}

export interface PendingInvite {
  id: string;
  email: string;
  role: MemberRole;
  invitedBy: string;
  invitedAt: Date;
  status: "pending" | "expired";
}

export type MemberRole = "owner" | "admin" | "member" | "guest";

const roleConfig: Record<MemberRole, { label: string; description: string; icon: React.ReactNode; color: string }> = {
  owner: {
    label: "Owner",
    description: "Full workspace control",
    icon: <Crown className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-800",
  },
  admin: {
    label: "Admin",
    description: "Manage members and settings",
    icon: <Shield className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800",
  },
  member: {
    label: "Member",
    description: "Standard workspace access",
    icon: <Users className="h-4 w-4" />,
    color: "bg-green-100 text-green-800",
  },
  guest: {
    label: "Guest",
    description: "Limited access",
    icon: <Users className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-800",
  },
};

export function WorkspaceMembersModal({
  open,
  onOpenChange,
  members,
  pendingInvites,
  onInviteMember,
  onUpdateMemberRole,
  onRemoveMember,
  onCancelInvite,
  onResendInvite,
  currentUserId,
}: WorkspaceMembersModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("members");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("member");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    onInviteMember(inviteEmail, inviteRole);
    setInviteEmail("");
    setInviteRole("member");
  };

  const canManageMembers = (member: WorkspaceMember) => {
    const currentUser = members.find(m => m.id === currentUserId);
    if (!currentUser) return false;
    if (member.id === currentUserId) return false;
    if (member.isOwner) return false;
    return currentUser.role === "owner" || currentUser.role === "admin";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t("workspace.members.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6">
            {/* Invite Form */}
            <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-semibold">
                    {t("workspace.members.inviteNew")}
                  </Label>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder={t("workspace.members.emailPlaceholder")}
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as MemberRole)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(roleConfig) as MemberRole[]).filter(role => role !== "owner").map((role) => (
                        <SelectItem key={role} value={role}>
                          <div className="flex items-center gap-2">
                            {roleConfig[role].icon}
                            <span>{roleConfig[role].label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleInvite} disabled={!inviteEmail.trim()}>
                    <Mail className="h-4 w-4 mr-2" />
                    {t("workspace.members.sendInvite")}
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("workspace.members.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Members List */}
              <div className="space-y-2">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{member.name}</span>
                          {member.id === currentUserId && (
                            <Badge variant="outline" className="text-xs">
                              {t("workspace.members.you")}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {member.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={roleConfig[member.role].color}>
                        <span className="flex items-center gap-1">
                          {roleConfig[member.role].icon}
                          {roleConfig[member.role].label}
                        </span>
                      </Badge>

                      {canManageMembers(member) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                              {t("workspace.members.actions")}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                              {t("workspace.members.changeRole")}
                            </DropdownMenuLabel>
                            {(Object.keys(roleConfig) as MemberRole[]).filter(role => role !== "owner" && role !== member.role).map((role) => (
                              <DropdownMenuItem
                                key={role}
                                onClick={() => onUpdateMemberRole(member.id, role)}
                              >
                                <div className="flex items-center gap-2">
                                  {roleConfig[role].icon}
                                  <span>{roleConfig[role].label}</span>
                                </div>
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                if (confirm(t("workspace.members.removeConfirm", { name: member.name }))) {
                                  onRemoveMember(member.id);
                                }
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("workspace.members.remove")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Pending Invites */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">{t("workspace.members.tabs.invites")} ({pendingInvites.length})</h3>
                </div>
                {pendingInvites.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t("workspace.members.noPendingInvites")}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingInvites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded-full bg-muted">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {invite.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t("workspace.members.invitedBy", { name: invite.invitedBy })} •{" "}
                            {new Date(invite.invitedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={roleConfig[invite.role].color}>
                          {roleConfig[invite.role].label}
                        </Badge>
                        {invite.status === "expired" ? (
                          <Badge variant="outline" className={getTagColor("expired")}>
                            <XCircle className="h-3 w-3 mr-1" />
                            {t("workspace.members.expired")}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className={getTagColor("pending")}>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {t("workspace.members.pending")}
                          </Badge>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onResendInvite(invite.id)}>
                              <Mail className="h-4 w-4 mr-2" />
                              {t("workspace.members.resendInvite")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onCancelInvite(invite.id)}
                              className="text-destructive"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              {t("workspace.members.cancelInvite")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>
          </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("workspace.members.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
