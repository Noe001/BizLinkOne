import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { queryClient } from "@/lib/queryClient";
import type { ChatMessage } from "@shared/schema";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface UseRealtimeMessagesOptions {
  channelId: string;
  enabled?: boolean;
}

/**
 * Supabase Realtime を使用してチャットメッセージをリアルタイム購読する
 * 
 * @param options - チャンネルIDと有効化フラグ
 * @returns リアルタイム接続の状態とメッセージ配列
 */
export function useRealtimeMessages({ channelId, enabled = true }: UseRealtimeMessagesOptions) {
  const { currentWorkspaceId } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const handleNewMessage = useCallback((payload: any) => {
    console.log("📨 New message received:", payload);
    
    // Query キャッシュを無効化して最新メッセージを取得
    queryClient.invalidateQueries({ 
      queryKey: ["chatMessages", "channel", channelId] 
    });
  }, [channelId]);

  const handleMessageUpdate = useCallback((payload: any) => {
    console.log("✏️ Message updated:", payload);
    
    // Query キャッシュを無効化
    queryClient.invalidateQueries({ 
      queryKey: ["chatMessages", "channel", channelId] 
    });
  }, [channelId]);

  const handleMessageDelete = useCallback((payload: any) => {
    console.log("🗑️ Message deleted:", payload);
    
    // Query キャッシュを無効化
    queryClient.invalidateQueries({ 
      queryKey: ["chatMessages", "channel", channelId] 
    });
  }, [channelId]);

  useEffect(() => {
    // 購読が無効、またはワークスペース/チャンネルIDがない場合は早期リターン
    if (!enabled || !currentWorkspaceId || !channelId || !isSupabaseConfigured()) {
      console.log("⏸️ Realtime subscription disabled", { 
        enabled, 
        currentWorkspaceId, 
        channelId,
        configured: isSupabaseConfigured() 
      });
      return;
    }

    console.log("🚀 Setting up Realtime subscription", { channelId, workspaceId: currentWorkspaceId });

    // Realtime チャンネルを作成
    const channel = supabase.channel(`chat:${channelId}`, {
      config: {
        broadcast: { self: false }, // 自分の送信メッセージは除外
      },
    });

    // INSERT イベントを購読
    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `workspaceId=eq.${currentWorkspaceId},channelId=eq.${channelId}`,
      },
      handleNewMessage
    );

    // UPDATE イベントを購読（編集機能用）
    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "chat_messages",
        filter: `workspaceId=eq.${currentWorkspaceId},channelId=eq.${channelId}`,
      },
      handleMessageUpdate
    );

    // DELETE イベントを購読（削除機能用）
    channel.on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "chat_messages",
        filter: `workspaceId=eq.${currentWorkspaceId},channelId=eq.${channelId}`,
      },
      handleMessageDelete
    );

    // チャンネルに接続
    channel.subscribe((status) => {
      console.log(`📡 Realtime status: ${status}`, { channelId });
      
      if (status === "SUBSCRIBED") {
        setIsConnected(true);
        setError(null);
      } else if (status === "CHANNEL_ERROR") {
        setIsConnected(false);
        setError(new Error("Failed to connect to Realtime channel"));
      } else if (status === "TIMED_OUT") {
        setIsConnected(false);
        setError(new Error("Realtime connection timed out"));
      }
    });

    channelRef.current = channel;

    // クリーンアップ: チャンネルを解除
    return () => {
      console.log("🔌 Unsubscribing from Realtime", { channelId });
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setIsConnected(false);
    };
  }, [currentWorkspaceId, channelId, enabled, handleNewMessage, handleMessageUpdate, handleMessageDelete]);

  return {
    isConnected,
    error,
  };
}
