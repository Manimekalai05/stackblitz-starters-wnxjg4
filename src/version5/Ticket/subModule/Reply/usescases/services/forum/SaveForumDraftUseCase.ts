import { Reply } from '../../model/Reply';
import { DraftRepository } from '../../repository/DraftRepository';
import NotificationBoundary from '../../repository/NotificationBoundary';

export class SaveForumDraftUseCase {
  constructor(
    private readonly draftRepo: DraftRepository,
    private readonly notifyService: NotificationBoundary
  ) {}

  async execute(replyInput: Reply): Promise<Reply> {
    return this.draftRepo
      .saveDraft(replyInput)
      .catch((err) => this.notifyService.notifyError(Reply.fromError(err)));
  }
}
