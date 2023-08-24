export function useForumReplyActions() {
  const [isDraft, setIsDraft] = useState(replyThread.status === 'DRAFT');
  const [draftId, setDraftId] = useState(isDraft ? replyThread.id : '');
  const [isAutoDraft, setIsAutoDraft] = useState(false);
  const { isAdminUser, currentUserId, ticket } = useForumReplyState({
    ticketId,
  });

  const isModerator = (isAdminUser, channelRelatedInfo) =>
    !isAdminUser &&
    channelRelatedInfo.moderators &&
    checkIsModerator(channelRelatedInfo.moderators, currentUserId);

  const saveForumDraft = (ticketId, content, isAutoTimer) => {
    const data = {
      channel: 'FORUMS',
      content,
    };
    return new Promise((resolve, reject) => {
      return dispatch(saveDraft(ticketId, data, isAutoTimer)).then(
        (res) => {
          setIsDraft(true);
          setIsAutoDraft(isAutoTimer);
          setDraftId(selectn('data.data.id', res));
          resolve(res);
        },
        (err) => {
          reject({ err, data });
        }
      );
    });
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

export function saveDraft(
  id,
  data,
  isAutoTimer,
  hookRejectCallback,
  isPrivate
) {
  const queryParam = isPrivate ? '?isPrivate=true' : '';
  return {
    types: generateAPITypes('SAVEDRAFT'),
    payload: { id, data },
    hookRejectCallback,
    callAPI: (state, getState) =>
      requestAPI(`/api/v1/tickets/${id}/draftReply`, false, {
        orgId: state.currentOrgId,
        featureFlags: 'downloadAttachUDS,scheduledReply',
      })
        .post('', data)
        .then((res) => {
          const newState = getState();
          const { id: threadId } = res;
          const isThreadRendered = isThreadInDom(newState, id, threadId);
          if (!isThreadRendered) {
            const threadObj = { [threadId]: res };
            const newThreadObj = {
              ...threadObj,
              ...newState.module.thread,
            };
            const oldThreads = newState.module.ticket[id].thread || [];
            const oldConversationIds =
              newState.module.ticket[id].conversationIds || [];
            const newThreadIds = [threadId, ...oldThreads];
            const idObj = { id: threadId, type: 'thread' };
            const newIdObj = [idObj, ...oldConversationIds];
            return {
              data: res,
              entities: {
                thread: newThreadObj,
                ticket: {
                  [id]: { thread: newThreadIds, conversationIds: newIdObj },
                },
              },
              id,
              isAutoTimer,
            };
          }
          return {
            data: res,
            id,
            isAutoTimer,
          };
        }),
  };
}
