import { Reply } from '../../model/Reply';
import { DraftRepository } from '../../repository/DraftRepository';
import NotificationBoundary from '../../repository/NotificationBoundary';

export class SaveEmailDraft {
  constructor(
    private readonly draftRepo: DraftRepository,
    private readonly notifyService: NotificationBoundary
  ) {}

  async execute(replyInput: Reply): Promise<Reply> {
    return this.draftRepo
      .sendReply(replyInput)
      .catch((err) => this.notifyService.notifyError(Reply.fromError(err)));
  }
}
