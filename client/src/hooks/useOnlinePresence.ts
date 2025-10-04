import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface PresenceState {
  user_id: string;
  user_name: string;
  online_at: string;
}

/**
 * Supabase Realtime Presence を使用してオンラインユーザーを追跡
 * 
 * @param workspaceId - ワークスペースID
 * @returns オンラインユーザーIDの配列と接続状態
 */
export function useOnlinePresence(workspaceId: string | null) {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const updateOnlineUsers = useCallback((presenceState: any) => {
    // Presence state から user_id を抽出
    const userIds = new Set<string>();
    Object.values(presenceState).forEach((presences: any) => {
      presences.forEach((presence: any) => {
        if (presence.user_id) {
          userIds.add(presence.user_id);
        }
      });
    });
    
    setOnlineUsers(Array.from(userIds));
    console.log("👥 Online users updated:", Array.from(userIds));
  }, []);

  useEffect(() => {
    if (!workspaceId || !user?.id || !isSupabaseConfigured()) {
      console.log("⏸️ Presence disabled", { workspaceId, userId: user?.id, configured: isSupabaseConfigured() });
      return;
    }

    console.log("🟢 Setting up Presence", { workspaceId, userId: user.id });

    // Presence チャンネルを作成
    const presenceChannel = supabase.channel(`presence:${workspaceId}`, {
      config: {
        presence: {
          key: user.id, // ユーザーごとにユニークなキー
        },
      },
    });

    // Presence sync イベントをリッスン
    presenceChannel.on("presence", { event: "sync" }, () => {
      const state = presenceChannel.presenceState();
      updateOnlineUsers(state);
    });

    // Join イベントをリッスン
    presenceChannel.on("presence", { event: "join" }, ({ newPresences }) => {
      console.log("✅ User joined:", newPresences);
    });

    // Leave イベントをリッスン
    presenceChannel.on("presence", { event: "leave" }, ({ leftPresences }) => {
      console.log("❌ User left:", leftPresences);
    });

    // チャンネルに接続
    presenceChannel.subscribe(async (status) => {
      console.log(`📡 Presence status: ${status}`, { workspaceId });
      
      if (status === "SUBSCRIBED") {
        setIsConnected(true);
        
        // 自分のプレゼンス情報を送信
        await presenceChannel.track({
          user_id: user.id,
          user_name: user.name,
          online_at: new Date().toISOString(),
        });
        
        console.log("✅ Presence tracked", { userId: user.id, userName: user.name });
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        setIsConnected(false);
      }
    });

    setChannel(presenceChannel);

    // クリーンアップ
    return () => {
      console.log("🔌 Cleaning up Presence", { workspaceId });
      if (presenceChannel) {
        presenceChannel.untrack();
        supabase.removeChannel(presenceChannel);
      }
      setIsConnected(false);
      setOnlineUsers([]);
    };
  }, [workspaceId, user?.id, user?.name, updateOnlineUsers]);

  return {
    onlineUsers,
    isConnected,
    channel,
  };
}
