import { Reply } from '../model/Reply';
import { DraftRepository } from '../repository/DraftRepository';
import NotificationBoundary from '../repository/NotificationBoundary';
import { ReplyServiceBoundary } from '../repository/ReplyServiceBoundary';
import { SaveForumDraftUseCase } from './forum/SaveForumDraftUseCase';

/***  FASCADE PATTERN***/
export default class ReplyServices implements ReplyServiceBoundary {
  constructor(
    protected draftRepo: DraftRepository,
    protected notifyService: NotificationBoundary
  ) {}

  public async saveForumDraft(replyInput: Reply): Promise<void> {
    return new SaveForumDraftUseCase(
      this.draftRepo,
      this.notifyService
    ).execute(replyInput);
  }
}
