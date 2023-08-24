import Ticket from '../../Domain/Ticket';
import { Reply } from '../model/Reply';
export interface DraftRepository {
  saveDraft(replyModel: Reply): Promise<Ticket>;
  updateDraft(replyModel: Reply): Promise<Ticket>;
  sendDraft(replyModel: Reply): Promise<Ticket>;
}
