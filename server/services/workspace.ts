import { nanoid } from 'nanoid';

// Workspace Service - インメモリ実装
// 本番環境ではSupabase/PostgreSQLに置き換え

interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatarUrl?: string;
  plan: 'free' | 'pro' | 'enterprise';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  userEmail: string;
  userName: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  joinedAt: string;
}

interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: 'admin' | 'member' | 'guest';
  token: string;
  invitedBy: string;
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
}

class WorkspaceService {
  private workspaces: Map<string, Workspace> = new Map();
  private members: Map<string, WorkspaceMember> = new Map();
  private invitations: Map<string, WorkspaceInvitation> = new Map();
  
  // ユーザーIDからワークスペースIDへのマッピング
  private userWorkspaces: Map<string, Set<string>> = new Map();

  constructor() {
    // デモ用のサンプルワークスペース
    const demoWorkspaceId = 'workspace-demo-001';
    const demoUserId = 'demo-user-1';
    
    this.workspaces.set(demoWorkspaceId, {
      id: demoWorkspaceId,
      name: 'Demo Workspace',
      slug: 'demo-workspace',
      description: 'サンプルワークスペース',
      plan: 'pro',
      ownerId: demoUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const demoMemberId = 'member-demo-001';
    this.members.set(demoMemberId, {
      id: demoMemberId,
      workspaceId: demoWorkspaceId,
      userId: demoUserId,
      userEmail: 'demo@example.com',
      userName: 'Demo User',
      role: 'owner',
      joinedAt: new Date().toISOString(),
    });

    this.userWorkspaces.set(demoUserId, new Set([demoWorkspaceId]));
  }

  // ワークスペース作成
  async createWorkspace(input: {
    name: string;
    slug: string;
    description?: string;
    ownerId: string;
    ownerEmail: string;
    ownerName: string;
  }): Promise<Workspace> {
    // スラッグの重複チェック
    for (const workspace of this.workspaces.values()) {
      if (workspace.slug === input.slug) {
        throw new Error('このスラッグは既に使用されています');
      }
    }

    const workspaceId = `workspace-${nanoid(12)}`;
    const workspace: Workspace = {
      id: workspaceId,
      name: input.name,
      slug: input.slug,
      description: input.description,
      plan: 'free',
      ownerId: input.ownerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.workspaces.set(workspaceId, workspace);

    // オーナーをメンバーに追加
    const memberId = `member-${nanoid(12)}`;
    const member: WorkspaceMember = {
      id: memberId,
      workspaceId,
      userId: input.ownerId,
      userEmail: input.ownerEmail,
      userName: input.ownerName,
      role: 'owner',
      joinedAt: new Date().toISOString(),
    };

    this.members.set(memberId, member);

    // ユーザーとワークスペースの紐付け
    if (!this.userWorkspaces.has(input.ownerId)) {
      this.userWorkspaces.set(input.ownerId, new Set());
    }
    this.userWorkspaces.get(input.ownerId)!.add(workspaceId);

    return workspace;
  }

  // ユーザーのワークスペース一覧取得
  async getUserWorkspaces(userId: string): Promise<Array<Workspace & { role: string; memberCount: number }>> {
    const workspaceIds = this.userWorkspaces.get(userId) || new Set();
    const result: Array<Workspace & { role: string; memberCount: number }> = [];

    for (const workspaceId of workspaceIds) {
      const workspace = this.workspaces.get(workspaceId);
      if (!workspace) continue;

      // ユーザーのロールを取得
      let userRole = 'member';
      for (const member of this.members.values()) {
        if (member.workspaceId === workspaceId && member.userId === userId) {
          userRole = member.role;
          break;
        }
      }

      // メンバー数をカウント
      let memberCount = 0;
      for (const member of this.members.values()) {
        if (member.workspaceId === workspaceId) {
          memberCount++;
        }
      }

      result.push({
        ...workspace,
        role: userRole,
        memberCount,
      });
    }

    return result;
  }

  // ワークスペース詳細取得
  async getWorkspace(workspaceId: string): Promise<Workspace | null> {
    return this.workspaces.get(workspaceId) || null;
  }

  // ワークスペース更新
  async updateWorkspace(
    workspaceId: string,
    updates: { name?: string; description?: string }
  ): Promise<Workspace | null> {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      return null;
    }

    const updatedWorkspace: Workspace = {
      ...workspace,
      ...(updates.name && { name: updates.name }),
      ...(updates.description !== undefined && { description: updates.description }),
      updatedAt: new Date().toISOString(),
    };

    this.workspaces.set(workspaceId, updatedWorkspace);
    return updatedWorkspace;
  }

  // ワークスペースメンバー取得
  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const result: WorkspaceMember[] = [];
    for (const member of this.members.values()) {
      if (member.workspaceId === workspaceId) {
        result.push(member);
      }
    }
    return result;
  }

  // 招待作成
  async createInvitation(input: {
    workspaceId: string;
    email: string;
    role: 'admin' | 'member' | 'guest';
    invitedBy: string;
  }): Promise<WorkspaceInvitation> {
    const invitationId = `invitation-${nanoid(12)}`;
    const token = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7日間有効

    const invitation: WorkspaceInvitation = {
      id: invitationId,
      workspaceId: input.workspaceId,
      email: input.email,
      role: input.role,
      token,
      invitedBy: input.invitedBy,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };

    this.invitations.set(invitationId, invitation);

    return invitation;
  }

  // 招待トークンで招待情報取得
  async getInvitationByToken(token: string): Promise<(WorkspaceInvitation & { workspaceName: string }) | null> {
    for (const invitation of this.invitations.values()) {
      if (invitation.token === token) {
        // 有効期限チェック
        if (new Date(invitation.expiresAt) < new Date()) {
          return null;
        }

        // 既に受諾済みかチェック
        if (invitation.acceptedAt) {
          return null;
        }

        const workspace = this.workspaces.get(invitation.workspaceId);
        if (!workspace) return null;

        return {
          ...invitation,
          workspaceName: workspace.name,
        };
      }
    }
    return null;
  }

  // 招待を受諾
  async acceptInvitation(input: {
    token: string;
    userId: string;
    userEmail: string;
    userName: string;
  }): Promise<{ workspace: Workspace; member: WorkspaceMember }> {
    const invitation = await this.getInvitationByToken(input.token);
    if (!invitation) {
      throw new Error('招待が見つからないか、有効期限が切れています');
    }

    // メールアドレスチェック
    if (invitation.email !== input.userEmail) {
      throw new Error('招待されたメールアドレスと一致しません');
    }

    // メンバー追加
    const memberId = `member-${nanoid(12)}`;
    const member: WorkspaceMember = {
      id: memberId,
      workspaceId: invitation.workspaceId,
      userId: input.userId,
      userEmail: input.userEmail,
      userName: input.userName,
      role: invitation.role,
      joinedAt: new Date().toISOString(),
    };

    this.members.set(memberId, member);

    // ユーザーとワークスペースの紐付け
    if (!this.userWorkspaces.has(input.userId)) {
      this.userWorkspaces.set(input.userId, new Set());
    }
    this.userWorkspaces.get(input.userId)!.add(invitation.workspaceId);

    // 招待を受諾済みにマーク
    for (const [id, inv] of this.invitations.entries()) {
      if (inv.token === input.token) {
        this.invitations.set(id, {
          ...inv,
          acceptedAt: new Date().toISOString(),
        });
        break;
      }
    }

    const workspace = this.workspaces.get(invitation.workspaceId)!;

    return { workspace, member };
  }

  // メンバー削除
  async removeMember(workspaceId: string, memberId: string): Promise<boolean> {
    const member = this.members.get(memberId);
    
    if (!member || member.workspaceId !== workspaceId) {
      return false;
    }

    // オーナーは削除できない
    if (member.role === 'owner') {
      throw new Error('オーナーは削除できません');
    }

    // メンバーを削除
    this.members.delete(memberId);

    // ユーザーとワークスペースの紐付けを削除
    const userWorkspaces = this.userWorkspaces.get(member.userId);
    if (userWorkspaces) {
      userWorkspaces.delete(workspaceId);
      if (userWorkspaces.size === 0) {
        this.userWorkspaces.delete(member.userId);
      }
    }

    return true;
  }

  // 招待取り消し
  async deleteInvitation(invitationId: string): Promise<boolean> {
    const invitation = this.invitations.get(invitationId);
    
    if (!invitation) {
      return false;
    }

    // 既に受諾済みの招待は削除できない
    if (invitation.acceptedAt) {
      throw new Error('既に受諾された招待は削除できません');
    }

    this.invitations.delete(invitationId);
    return true;
  }

  // ワークスペースの招待一覧取得
  async getWorkspaceInvitations(workspaceId: string): Promise<WorkspaceInvitation[]> {
    const result: WorkspaceInvitation[] = [];
    for (const invitation of this.invitations.values()) {
      if (invitation.workspaceId === workspaceId && !invitation.acceptedAt) {
        result.push(invitation);
      }
    }
    return result;
  }
}

export const workspaceService = new WorkspaceService();
