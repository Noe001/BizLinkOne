export interface MessageModalContext {
  messageId: string;
  content: string;
  authorName: string;
  channelId?: string;
}

export * from './chat';
