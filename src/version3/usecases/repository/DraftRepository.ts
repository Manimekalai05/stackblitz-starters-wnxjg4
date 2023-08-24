import Ticket from '../Entity/Ticket';
import { Reply } from '../model/Reply';
export interface DraftRepository {
  saveDraft(replyModel: Reply): Promise<Ticket>;
  updateDraft(replyModel: Reply): Promise<Ticket>;
  sendDraft(replyModel: Reply): Promise<Ticket>;
}
