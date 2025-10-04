import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Building2, Users, Mail, Trash2, Copy, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WorkspaceData {
  id: string;
  name: string;
  slug: string;
  description: string;
  ownerId: string;
}

interface WorkspaceMember {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  joinedAt: string;
}

interface WorkspaceInvitation {
  id: string;
  email: string;
  role: string;
  token: string;
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
}

export default function WorkspaceSettingsPage() {
  const [, setLocation] = useLocation();
  const { user, currentWorkspaceId } = useAuth();
  const { toast } = useToast();
  
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // フォーム状態
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [saving, setSaving] = useState(false);
  const [inviting, setInviting] = useState(false);
  
  // 削除確認ダイアログ
  const [memberToDelete, setMemberToDelete] = useState<WorkspaceMember | null>(null);
  const [invitationToDelete, setInvitationToDelete] = useState<WorkspaceInvitation | null>(null);
  
  // コピー状態
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !currentWorkspaceId) {
      setLocation('/workspace/select');
      return;
    }

    fetchWorkspaceData();
  }, [user, currentWorkspaceId, setLocation]);

  const fetchWorkspaceData = async () => {
    try {
      // ワークスペース情報を取得
      const workspaceRes = await fetch(`/api/workspaces/${currentWorkspaceId}`);
      if (workspaceRes.ok) {
        const workspaceData = await workspaceRes.json();
        setWorkspace(workspaceData);
        setWorkspaceName(workspaceData.name);
        setWorkspaceDescription(workspaceData.description || '');
      }

      // メンバー一覧を取得
      const membersRes = await fetch(`/api/workspaces/${currentWorkspaceId}/members`);
      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setMembers(membersData);
      }

      // 招待一覧を取得（実装待ち）
      // const invitationsRes = await fetch(`/api/workspaces/${currentWorkspaceId}/invitations`);
      // if (invitationsRes.ok) {
      //   const invitationsData = await invitationsRes.json();
      //   setInvitations(invitationsData);
      // }

      // 招待一覧を取得
      const invitationsRes = await fetch(`/api/workspaces/${currentWorkspaceId}/invitations`);
      if (invitationsRes.ok) {
        const invitationsData = await invitationsRes.json();
        setInvitations(invitationsData);
      }
    } catch (error) {
      console.error('Failed to fetch workspace data:', error);
      toast({
        title: 'エラー',
        description: 'ワークスペース情報の取得に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorkspace = async () => {
    if (!workspace) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/workspaces/${workspace.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: workspaceName,
          description: workspaceDescription,
        }),
      });

      if (!response.ok) throw new Error('Failed to update workspace');

      toast({
        title: '保存しました',
        description: 'ワークスペース情報を更新しました',
      });

      fetchWorkspaceData();
    } catch (error) {
      console.error('Failed to update workspace:', error);
      toast({
        title: 'エラー',
        description: 'ワークスペース情報の更新に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail || !currentWorkspaceId) return;

    setInviting(true);
    try {
      const response = await fetch(`/api/workspaces/${currentWorkspaceId}/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
          invitedBy: user?.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to create invitation');

      const invitation = await response.json();

      toast({
        title: '招待を送信しました',
        description: `${inviteEmail} に招待リンクを送信しました`,
      });

      setInviteEmail('');
      setInviteRole('member');
      fetchWorkspaceData();
    } catch (error) {
      console.error('Failed to invite member:', error);
      toast({
        title: 'エラー',
        description: 'メンバーの招待に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setInviting(false);
    }
  };

  const handleCopyInviteLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/workspace/join?token=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
    
    toast({
      title: 'コピーしました',
      description: '招待リンクをクリップボードにコピーしました',
    });
  };

  const handleDeleteMember = async (member: WorkspaceMember) => {
    if (!currentWorkspaceId) return;

    try {
      const response = await fetch(`/api/workspaces/${currentWorkspaceId}/members/${member.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete member');
      }

      toast({
        title: 'メンバーを削除しました',
        description: `${member.userName} をワークスペースから削除しました`,
      });

      fetchWorkspaceData();
    } catch (error) {
      console.error('Failed to delete member:', error);
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : 'メンバーの削除に失敗しました',
        variant: 'destructive',
      });
    } finally {
      setMemberToDelete(null);
    }
  };

  const handleDeleteInvitation = async (invitation: WorkspaceInvitation) => {
    try {
      const response = await fetch(`/api/invitations/${invitation.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete invitation');
      }

      toast({
        title: '招待を取り消しました',
        description: `${invitation.email} への招待を取り消しました`,
      });

      fetchWorkspaceData();
    } catch (error) {
      console.error('Failed to delete invitation:', error);
      toast({
        title: 'エラー',
        description: error instanceof Error ? error.message : '招待の取り消しに失敗しました',
        variant: 'destructive',
      });
    } finally {
      setInvitationToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              ワークスペース情報が見つかりません
            </p>
            <div className="text-center mt-4">
              <Button onClick={() => setLocation('/workspace/select')}>
                ワークスペースを選択
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = workspace.ownerId === user?.id;

  return (
    <div className="container max-w-4xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ワークスペース設定</h1>
        <p className="text-muted-foreground mt-2">
          {workspace.name} の設定を管理します
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">一般</TabsTrigger>
          <TabsTrigger value="members">メンバー</TabsTrigger>
          <TabsTrigger value="invitations">招待</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ワークスペース情報</CardTitle>
              <CardDescription>
                ワークスペースの基本情報を編集します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">ワークスペース名</Label>
                <Input
                  id="workspace-name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="例: Acme Inc"
                  disabled={!isOwner}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspace-slug">URL (変更不可)</Label>
                <Input
                  id="workspace-slug"
                  value={workspace.slug}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  ワークスペースのURLは変更できません
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspace-description">説明（任意）</Label>
                <Textarea
                  id="workspace-description"
                  value={workspaceDescription}
                  onChange={(e) => setWorkspaceDescription(e.target.value)}
                  placeholder="ワークスペースの説明を入力..."
                  rows={3}
                  disabled={!isOwner}
                />
              </div>

              {isOwner && (
                <div className="flex justify-end">
                  <Button onClick={handleSaveWorkspace} disabled={saving}>
                    {saving ? '保存中...' : '変更を保存'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>メンバー ({members.length})</CardTitle>
              <CardDescription>
                ワークスペースのメンバーを管理します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between py-3 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {member.userName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.userEmail}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                      {isOwner && member.userId !== user?.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setMemberToDelete(member)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>メンバーを招待</CardTitle>
              <CardDescription>
                メールアドレスで新しいメンバーを招待します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleInviteMember} disabled={inviting || !inviteEmail}>
                    {inviting ? '招待中...' : '招待を送信'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {invitations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>保留中の招待 ({invitations.length})</CardTitle>
                <CardDescription>
                  まだ受諾されていない招待のリスト
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between py-3 border-b last:border-b-0"
                    >
                      <div>
                        <div className="font-medium">{invitation.email}</div>
                        <div className="text-sm text-muted-foreground">
                          招待日: {new Date(invitation.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyInviteLink(invitation.token)}
                        >
                          {copiedToken === invitation.token ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span className="ml-2">リンクをコピー</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setInvitationToDelete(invitation)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* メンバー削除確認ダイアログ */}
      <AlertDialog open={!!memberToDelete} onOpenChange={(open) => !open && setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>メンバーを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              {memberToDelete?.userName} をワークスペースから削除します。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => memberToDelete && handleDeleteMember(memberToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 招待削除確認ダイアログ */}
      <AlertDialog open={!!invitationToDelete} onOpenChange={(open) => !open && setInvitationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>招待を取り消しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              {invitationToDelete?.email} への招待を取り消します。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => invitationToDelete && handleDeleteInvitation(invitationToDelete)}
            >
              取り消し
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
