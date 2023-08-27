import { Reply } from '../model/Reply';

export interface ReplyServiceBoundary {
  saveForumDraft(ReplyInput: Reply): Promise<Reply>;
  saveEmailDraft(ReplyInput: Reply): Promise<Reply>;
  sendEmailReply(ReplyInput: Reply): Promise<Reply>;
}
