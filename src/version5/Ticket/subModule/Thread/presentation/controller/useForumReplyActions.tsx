import { useEffect, useState } from 'react';
import ReplyActionResource from '../../../ReplyEditor /infrastructure/ReplyActionResource';
import { Reply } from '../../usescases/model/Reply';
import ReplyServices from '../../usescases/services/ReplyService';

const replyRepo = new ReplyActionResource();
const notifyServices = new ForumNotificationServices();
const replyServices = new ReplyServices(replyRepo, notifyServices);

export function useForumReplyActions() {
  const [isDraft, setIsDraft] = useState(replyThread.status === 'DRAFT');
  const [draftId, setDraftId] = useState(isDraft ? replyThread.id : '');
  const [isAutoDraft, setIsAutoDraft] = useState(false);
  const { isAdminUser, currentUserId, ticket } = useForumReplyState({
    ticketId,
  });

  const saveForumDraft = (ticketId, content) => {
    return replyServices.saveForumDraft(
      Reply.fromProperties({ id: ticketId, content })
    );
  };

  return {
    isAdminUser,
    isDraft,
    draftId,
    isAutoDraft,
    isModerator,
    saveForumDraft,
  };
}
