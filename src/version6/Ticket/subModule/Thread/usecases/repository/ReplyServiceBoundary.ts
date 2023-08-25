import { Reply } from '../model/Reply';

export interface ReplyServiceBoundary {
  saveForumDraft(ReplyInput: Reply): Promise<Reply>;
  SendForumDraft(ReplyInput: Reply): Promise<Reply>;
}
