import { Reply } from '../model/Reply';

export interface ReplyServiceBoundary {
  saveDraft(ReplyInput: Reply): Promise<void>;
}
