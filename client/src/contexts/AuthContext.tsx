import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// 環境変数のチェック
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  loading: boolean;
  currentWorkspaceId: string | null;
  setCurrentWorkspaceId: (workspaceId: string) => void;
  signUp: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<{ error: Error | null }>;
  resendOTP: (email: string) => Promise<{ error: Error | null }>;
  checkEmailExists: (email: string) => Promise<{ exists: boolean; error: Error | null }>;
  completeSignup: (email: string, name: string, password: string) => Promise<{ error: Error | null }>;
  joinWorkspaceByInvite: (inviteToken: string) => Promise<{ error: Error | null }>;
  // 後方互換性のため残す
  login: (user: User) => void;
  logout: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    // localStorageからユーザー情報を復元（デモモード対応）
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(() => {
    // localStorageから復元
    return localStorage.getItem('currentWorkspaceId');
  });

  // ユーザー情報が変更されたらlocalStorageに保存
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  // ワークスペースIDが変更されたらlocalStorageに保存
  useEffect(() => {
    if (currentWorkspaceId) {
      localStorage.setItem('currentWorkspaceId', currentWorkspaceId);
    } else {
      localStorage.removeItem('currentWorkspaceId');
    }
  }, [currentWorkspaceId]);

  useEffect(() => {
    // localStorageからユーザーを復元済みの場合はデモモードとして扱う
    const hasLocalUser = !!localStorage.getItem('currentUser');
    
    // 初期セッションの取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      // Supabaseユーザーがいる場合のみ上書き（デモモードを保持）
      if (session?.user) {
        setUser(mapSupabaseUserToUser(session.user));
      }
      setLoading(false);
    }).catch((error) => {
      console.log('Supabase session check failed (using demo mode):', error);
      setLoading(false);
    });

    // 認証状態の変更をリッスン
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        // Supabaseユーザーでログインした場合
        setUser(mapSupabaseUserToUser(session.user));
      } else if (!hasLocalUser) {
        // localStorageにユーザーがいない場合のみnullに設定
        setUser(null);
      }
      // hasLocalUserがtrueの場合は既存のユーザー情報を保持（デモモード）
    });

    return () => subscription.unsubscribe();
  }, []);

  // Supabaseユーザーを内部User型にマッピング
  const mapSupabaseUserToUser = (supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      avatar: supabaseUser.user_metadata?.avatar_url,
      role: supabaseUser.user_metadata?.role || 'member',
    };
  };

  // サインアップ（メール確認が必要）
  const signUp = async (email: string, password: string, username: string) => {
    try {
      // 開発環境でSupabaseが利用できない場合はデモモード
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Demo mode: Using mock authentication');
        return { error: null };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
          emailRedirectTo: undefined, // メールリンクを使わない
        },
      });

      if (error) throw error;

      // サインアップ成功（メール確認待ち）
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as Error };
    }
  };

  // OTP検証
  const verifyOTP = async (email: string, token: string) => {
    try {
      // デモモード: example.comドメインは常に成功
      if (email.endsWith('@example.com')) {
        console.warn('Demo mode: OTP verification simulated for', email);
        // 検証成功として扱うが、ユーザーオブジェクトは設定しない
        // （completeSignupで設定される）
        return { error: null };
      }

      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Demo mode: OTP verification simulated');
        const demoUser: User = {
          id: 'demo-user-' + Date.now(),
          name: email.split('@')[0],
          email: email,
          role: 'member',
        };
        setUser(demoUser);
        return { error: null };
      }

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      });

      if (error) throw error;

      if (data.user) {
        setUser(mapSupabaseUserToUser(data.user));
      }

      return { error: null };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { error: error as Error };
    }
  };

  // OTP再送信
  const resendOTP = async (email: string) => {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Demo mode: OTP resend simulated');
        return { error: null };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('OTP resend error:', error);
      return { error: error as Error };
    }
  };

  // メールアドレスの存在チェック(Slack風)
  const checkEmailExists = async (email: string) => {
    try {
      // デモモード: example.comドメインは常に存在するものとして扱う
      if (email.endsWith('@example.com')) {
        const registeredEmails = JSON.parse(localStorage.getItem('registeredEmails') || '["demo@example.com", "test@example.com"]');
        const exists = registeredEmails.includes(email);
        console.log(`Demo mode: Email check for ${email}: ${exists ? 'exists' : 'new'}`);
        return { exists, error: null };
      }
      
      // デモモード: ローカルストレージで登録済みメールを管理
      // 本番環境では専用のAPIエンドポイントを用意することを推奨
      const registeredEmails = JSON.parse(localStorage.getItem('registeredEmails') || '["demo@example.com", "test@example.com"]');
      const exists = registeredEmails.includes(email);
      
      console.log(`Email check for ${email}: ${exists ? 'exists' : 'new'}`);
      return { exists, error: null };
    } catch (error) {
      console.error('Email check error:', error);
      return { exists: false, error: error as Error };
    }
  };

  // サインアップ完了（Slack風：確認コード検証後に名前とパスワード設定）
  const completeSignup = async (email: string, name: string, password: string) => {
    try {
      // デモモード: example.comドメインは常にデモユーザーとして扱う
      if (email.endsWith('@example.com')) {
        console.warn('Demo mode: Complete signup simulated for', email);
        const demoUser: User = {
          id: 'demo-user-' + Date.now(),
          name: name,
          email: email,
          role: 'member',
        };
        setUser(demoUser);
        
        // メールを登録済みリストに追加
        const registeredEmails = JSON.parse(localStorage.getItem('registeredEmails') || '["test@example.com"]');
        if (!registeredEmails.includes(email)) {
          registeredEmails.push(email);
          localStorage.setItem('registeredEmails', JSON.stringify(registeredEmails));
        }
        
        return { error: null };
      }

      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Demo mode: Complete signup simulated');
        const demoUser: User = {
          id: 'demo-user-' + Date.now(),
          name: name,
          email: email,
          role: 'member',
        };
        setUser(demoUser);
        
        // メールを登録済みリストに追加
        const registeredEmails = JSON.parse(localStorage.getItem('registeredEmails') || '["test@example.com"]');
        if (!registeredEmails.includes(email)) {
          registeredEmails.push(email);
          localStorage.setItem('registeredEmails', JSON.stringify(registeredEmails));
        }
        
        return { error: null };
      }

      // Supabaseでは、サインアップ時にパスワードを設定する必要があるため、
      // ここでは既に作成されたアカウントを更新する
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          username: name,
        },
      });

      if (updateError) throw updateError;

      // ユーザー情報を再取得
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(mapSupabaseUserToUser(data.user));
      }

      return { error: null };
    } catch (error) {
      console.error('Complete signup error:', error);
      return { error: error as Error };
    }
  };

  // 招待リンクからワークスペースに参加
  const joinWorkspaceByInvite = async (inviteToken: string) => {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Demo mode: Join workspace simulated');
        return { error: null };
      }

      // 招待トークンを使ってワークスペースに参加
      // 本番環境では専用のAPIエンドポイントを使用
      const response = await fetch(`/api/workspaces/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inviteToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join workspace');
      }

      return { error: null };
    } catch (error) {
      console.error('Join workspace error:', error);
      return { error: error as Error };
    }
  };

  // サインイン
  const signIn = async (email: string, password: string) => {
    try {
      // デモモード: example.comドメインは常にデモユーザーとして扱う
      if (email.endsWith('@example.com') || email === 'demo@example.com') {
        console.warn('Demo mode: Using mock authentication for', email);
        const registeredEmails = JSON.parse(localStorage.getItem('registeredEmails') || '["demo@example.com", "test@example.com"]');
        
        // 登録済みメールかチェック
        if (!registeredEmails.includes(email)) {
          throw new Error('このメールアドレスは登録されていません');
        }
        
        const demoUser: User = {
          id: 'demo-user-1',
          name: 'Demo User',
          email: email,
          role: 'member',
        };
        setUser(demoUser);
        
        // デモワークスペースに自動参加
        setCurrentWorkspaceId('workspace-demo-001');
        
        return { error: null };
      }
      
      // 開発環境でSupabaseが利用できない場合はデモログイン
      if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Demo mode: Using mock authentication');
        const demoUser: User = {
          id: 'demo-user-id',
          name: 'Demo User',
          email: email,
          role: 'member',
        };
        setUser(demoUser);
        return { error: null };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as Error };
    }
  };

  // サインアウト
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // デモモード対応: localStorageもクリア
      setUser(null);
      setSession(null);
      setCurrentWorkspaceId(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentWorkspaceId');
    }
  };

  // 後方互換性のため（既存コードが動作するように）
  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    signOut();
  };

  // デモモードではuserがあれば認証済みとみなす
  const isAuthenticated = !!session || !!user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        session,
        loading,
        currentWorkspaceId,
        setCurrentWorkspaceId,
        signUp,
        signIn,
        signOut,
        verifyOTP,
        resendOTP,
        checkEmailExists,
        completeSignup,
        joinWorkspaceByInvite,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
