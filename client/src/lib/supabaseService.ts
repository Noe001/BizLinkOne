import { supabase } from './supabase';
import type {
  Task,
  InsertTask,
  KnowledgeArticle,
  InsertKnowledgeArticle,
  Meeting,
  InsertMeeting,
  ChatMessage,
  InsertChatMessage,
} from '@shared/schema';

/**
 * Supabaseデータベース操作サービス
 * クライアントサイドから安全にデータベースを操作するためのラッパー
 */

// ==================== Tasks ====================

export const TaskService = {
  /**
   * 全タスクを取得
   */
  async getAll() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Task[];
  },

  /**
   * 特定のタスクを取得
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Task;
  },

  /**
   * タスクを作成
   */
  async create(task: InsertTask) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  /**
   * タスクを更新
   */
  async update(id: string, updates: UpdateTask) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Task;
  },

  /**
   * タスクを削除
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ==================== Knowledge Articles ====================

export const KnowledgeService = {
  /**
   * 全ナレッジ記事を取得
   */
  async getAll() {
    const { data, error } = await supabase
      .from('knowledge_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as KnowledgeArticle[];
  },

  /**
   * 特定のナレッジ記事を取得
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('knowledge_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as KnowledgeArticle;
  },

  /**
   * ナレッジ記事を作成
   */
  async create(article: InsertKnowledgeArticle) {
    const { data, error } = await supabase
      .from('knowledge_articles')
      .insert(article)
      .select()
      .single();

    if (error) throw error;
    return data as KnowledgeArticle;
  },

  /**
   * ナレッジ記事を更新
   */
  async update(id: string, updates: UpdateKnowledgeArticle) {
    const { data, error } = await supabase
      .from('knowledge_articles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as KnowledgeArticle;
  },

  /**
   * ナレッジ記事を削除
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('knowledge_articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * 閲覧数を増やす
   */
  async incrementViews(id: string) {
    const { error } = await supabase.rpc('increment_article_views', { article_id: id });

    // RPC関数が存在しない場合は手動で更新
    if (error) {
      const article = await this.getById(id);
      await this.update(id, { views: (article.views || 0) + 1 });
    }
  },
};

// ==================== Meetings ====================

export const MeetingService = {
  /**
   * 全ミーティングを取得
   */
  async getAll() {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data as Meeting[];
  },

  /**
   * 特定のミーティングを取得
   */
  async getById(id: string) {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Meeting;
  },

  /**
   * ミーティングを作成
   */
  async create(meeting: InsertMeeting) {
    const { data, error } = await supabase
      .from('meetings')
      .insert(meeting)
      .select()
      .single();

    if (error) throw error;
    return data as Meeting;
  },

  /**
   * ミーティングを更新
   */
  async update(id: string, updates: UpdateMeeting) {
    const { data, error } = await supabase
      .from('meetings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Meeting;
  },

  /**
   * ミーティングを削除
   */
  async delete(id: string) {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ==================== Chat Messages ====================

export const ChatService = {
  /**
   * チャンネルのメッセージを取得
   */
  async getMessages(channelId?: string) {
    let query = supabase
      .from('chat_messages')
      .select('*')
      .order('timestamp', { ascending: true });

    if (channelId) {
      query = query.eq('channel_id', channelId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as ChatMessage[];
  },

  /**
   * メッセージを送信
   */
  async sendMessage(message: InsertChatMessage) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data as ChatMessage;
  },

  /**
   * リアルタイムでメッセージを購読
   */
  subscribeToMessages(channelId: string | undefined, callback: (message: ChatMessage) => void) {
    let channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: channelId ? `channel_id=eq.${channelId}` : undefined,
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
