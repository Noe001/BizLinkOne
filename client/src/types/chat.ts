import type {
  ChatAttachment,
  ChatMessageWithExtras,
  ChatMessagesResponse as SharedChatMessagesResponse,
  ChatReactionSummary,
  ChatReadReceipt,
} from '@shared/schema';

export type ChatReactionSummaryDto = ChatReactionSummary;

export type ChatMessageWithExtrasDto = ChatMessageWithExtras & { isPending?: boolean };

export interface ChatMessagesResponse extends SharedChatMessagesResponse {}

export type ChatAttachmentDto = ChatAttachment;

export type ChatReadReceiptDto = ChatReadReceipt;
