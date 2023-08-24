function ForumReply({ editorId, ticketId, replyThread }) {
  const { isTicketReplying, isModerator, saveForumDraft } =
    useForumReplyActions({
      replyThread,
      ticketId,
      isContentModified,
    });

  return (
    <React.Fragment>
      <CommonReplyUI
        renderFooter={() => (
          <ForumFooter
            ticketId={ticketId}
            saveDraft={saveForumDraft}
            isDraft={isDraftThread}
            isTicketReplying={isTicketReplying}
            haveSetForumStatusPermission={isAdminUser || isModerator}
          />
        )}
        editorId={editorId}
        ticketId={ticketId}
        isSaveDraft={isSaveDraft}
        content={content}
        departmentId={departmentId}
      />
    </React.Fragment>
  );
}

export default ForumReply;
