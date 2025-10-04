import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface UploadOptions {
  workspaceId: string;
  channelId: string;
}

export interface UploadResult {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_.-]/g, '_');
}

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadChatAttachment(file: File, options: UploadOptions): Promise<UploadResult> {
  const { workspaceId, channelId } = options;
  const sanitizedName = sanitizeFileName(file.name);
  const timestamp = Date.now();
  const storagePath = `${workspaceId}/${channelId}/${timestamp}-${sanitizedName}`;

  if (isSupabaseConfigured()) {
    const { error } = await supabase.storage
      .from('chat-attachments')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error('Failed to upload attachment to Supabase Storage', error);
      throw new Error(error.message || 'Unable to upload attachment');
    }

    const { data } = supabase.storage.from('chat-attachments').getPublicUrl(storagePath);
    if (!data?.publicUrl) {
      throw new Error('Unable to resolve attachment URL');
    }

    return {
      fileName: file.name,
      fileUrl: data.publicUrl,
      fileSize: file.size,
      mimeType: file.type,
    };
  }

  // Development fallback: embed file as data URL so attachments remain functional without Supabase.
  const dataUrl = await readFileAsDataUrl(file);
  return {
    fileName: file.name,
    fileUrl: dataUrl,
    fileSize: file.size,
    mimeType: file.type,
  };
}
