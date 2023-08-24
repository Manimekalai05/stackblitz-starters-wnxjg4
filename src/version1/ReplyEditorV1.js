import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import ReactDOMServer from 'react-dom/server';
import selectn from 'selectn';
/*Big Import statements*/

export class ReplyEdtiorV1 extends Component {
  constructor(props) {
    super(props);
    // Class properties Initialization
    this.recepientsOpenInitialState = false;
    this.totalAttachmentSize = 0;
    this.attachIndex = 0;
    this.autoCCAddress = [];
    this.timerId = '';
    this.editorClosed = false;
    this.focusTo = false;
    this.draftInProgress = false;
    this.cloudAttachmentCount = 0;
    this._isMounted = false;
    this.state = {
      emailListPopulated: false,
      ccFromTickets: [],
      isAutoDraft: false,
      newAttachments: [],
      toAddress: [],
      ccAddress: [],
      bccAddress: [],
      inValideArr: [],
      ticketCcIds: [],
      isForwardReply: props.replyMode === 'forward',
      draftText: i18NProviderUtils.getI18NValue(
        'support.common.request.mail.save.draft'
      ),
      selectedFromAddress: '',
      searchMode: '',
      searchData: [],
      isRecipientsVisible: false,
      isPrivateButtonEnable: true,
      isSnippetActionOpen: false,
      previewObj: null,
      snippetDataMode: null,
      isAttachmentInProgress: false,
      inlineAttachmentProgress: false,
      isToEmpty: props.isEditorToAddressEmpty || false,
      isCcInvalid: false,
      isBccInvalid: false,
      contentModified: false,
      isDeleteDraftActive: false,
      isAttachmentViewerActive: false,
      isSnippetActive: false,
      isEmailTemplateActive: false,
      isCCRemovalAlertActive: false,
      removableCCs: [],
      shouldUpdateContent: true,
      isDrafting: false,
      isScheduling: false,
      showSchedulePopup: false,
      isScheduleTimeActive: true,
      showTimeExpiryConfirmation: false,
      isScheduleActive: false,
      isReplying: false,
    };
  }

  saveDraft(isAutoTimer, scheduleData) {
    if (this.isAttachmentInProgress()) {
      return Promise.resolve();
    }

    const {
      saveDraft,
      closeEdtior,
      replyMode,
      haveMailSendPermission,
      showMessage,
      ticketId,
    } = this.props;
    const { isScheduleActive } = this.state;
    if (this.ticketId !== ticketId) {
      // for debugging incident 847402
      showMessage({
        type: 'danger',
        message: i18NProviderUtils.getI18NValue(
          'support.wrong.ticket.reply.error'
        ),
      });
      error_details.message = `WTD - Actual - ${this.ticketId} Wrng - ${ticketId}`;
      murphy.addCustomTracking(error_details);
      murphy.error(new Error(`WRONG SAVE DRAFT`));
      return;
    }
    if (replyMode === 'forum') {
      const content = this.getContent();
      const data = {
        channel: 'FORUMS',
        content,
      };
      saveDraft(
        data,
        () => {
          this.setState({
            isDraft: true,
            isAutoDraft: isAutoTimer,
            contentModified: false,
          });

          !isAutoTimer && closeEdtior();
        },
        isAutoTimer
      );
      return;
    }

    if (!haveMailSendPermission) {
      return;
    }

    this.setState({
      draftText: isScheduleActive
        ? 'Saving Reply'
        : `${i18NProviderUtils.getI18NValue(
            'support.common.request.mail.saving.draft'
          )} ...`,
      isDrafting: true,
      isScheduling: scheduleData && true,
    });
    const {
      editorId,
      revertIsEditorChanged,
      isEditorChanged,
      isCustomChannel,
      channelInfo,
      replyThread = {},
      getTicket,
      ticket,
      updateTicket,
    } = this.props;
    const { attachmentIds, selectedFromAddress, ticketCcIds, isPrivateThread } =
      this.state;
    const content = this.getContent();
    const emailObj = this.getEmailObj();
    const inReplyToThreadId = replyThread.id != ticketId ? replyThread.id : '';
    let contentType =
      selectn(`editor[${editorId}].mode`, global) === 'richtext'
        ? 'html'
        : 'plainText';
    let data = {
      channel: 'EMAIL',
      attachmentIds,
      to: emailObj.toArr,
      cc: emailObj.ccArr,
      bcc: emailObj.bccArr,
      fromEmailAddress: selectedFromAddress,
      contentType,
      content,
      isForward: this.isForwardThread(),
      isPrivate: isPrivateThread,
    };
    inReplyToThreadId && (data.inReplyToThreadId = inReplyToThreadId);
    if (isCustomChannel) {
      // let contentType = 'html';
      const { code, replyConfig } = channelInfo;
      if (!replyConfig.contentTypes.includes('text/html')) {
        contentType = 'plainText';
      }
      data = {
        content,
        channel: code,
        contentType,
        attachmentIds,
        isPrivate: isPrivateThread,
      };
    }
    if (
      replyMode !== 'forward' &&
      ticket.secondaryContacts.length > 0 &&
      ticket.secondaryContacts.length !== ticketCcIds.length
    ) {
      updateTicket(ticketId, {
        secondaryContacts: this.getSecondarContactIds(),
      })
        .then(() => {})
        .catch(() => {
          showMessage({
            type: 'danger',
            message: i18NProviderUtils.getI18NValue(
              'support.secondary.contact.remove.error'
            ),
          });
        });
    }
    return saveDraft(
      data,
      (res) => {
        isEditorChanged && revertIsEditorChanged();
        this.updateDraftText(res);
        if (res.status && res.status !== 200) {
          return;
        }
        const { newAttachments } = this.state;
        const newAttach = newAttachments.filter(
          (attach) => typeof attach.percentComplete !== 'undefined'
        );
        const attachmentIds = this.getAttachmentIds(res.data.attachments);
        this.setState({
          isDraft: true,
          newAttachments: newAttach,
          attachmentIds,
          contentModified: false,
        });
      },
      isAutoTimer,
      () => {
        this.setState({
          draftText: i18NProviderUtils.getI18NValue(
            'support.common.request.mail.save.draft'
          ),
          isDraft: false,
          isDrafting: false,
        });
      }
    );
  } /*need*/

  constructReplyHeader() {
    const {
      replyThread = {},
      replyMode,
      ticket,
      ticketId,
      editorId,
      isCustomChannel,
    } = this.props;

    const { to, cc, from, fromEmailAddress, phoneno, channel, author } =
      replyThread;

    let { email: authorEmail = '' } = author || {};
    const { name: authorName = '' } = author || {};

    authorEmail = authorEmail ? `<${authorEmail}>` : '';
    const authorAddress = `${authorName}${authorEmail}`;

    const contHeaderDate = i18NProviderUtils.userDateFormat(
      new Date(replyThread.createdTime),
      {},
      'lateby',
      'left',
      false,
      () => 'DDD, DD MMM YYYY HH:mm:ss'
    );

    let offset = datetime.tz.offset(replyThread.createdTime);
    offset = parseInteger(offset);
    offset =
      (offset < 0 ? '+' : '-') +
      pad(parseInteger(Math.abs(offset / 60)), 2) +
      pad(Math.abs(offset % 60), 2);
    let replyHeader = '';
    if (ticketId !== editorId) {
      let fromAddress = fromEmailAddress || authorAddress;
      if (isCustomChannel) {
        fromAddress = from;
      } else if (channel === 'TELEPHONY') {
        fromAddress = phoneno;
      }
      if (replyMode === 'forward') {
        replyHeader = `<div><div>============ ${i18NProviderUtils.getI18NValue(
          'support.mail.header.forwarded.message'
        )} ============<br></div><div>${i18NProviderUtils.getI18NValue(
          'support.request.from.emailid'
        )}:  ${encodeForHtml(fromAddress)}<br></div>`;
        if (encodeForHtml(to)) {
          replyHeader += `<div>${i18NProviderUtils.getI18NValue(
            'crm.label.to.email'
          )}: ${encodeForHtml(to)}<br></div>`;
        }
        if (encodeForHtml(cc)) {
          replyHeader += `<div>${i18NProviderUtils.getI18NValue(
            'crm.label.cc.email'
          )}: ${encodeForHtml(cc)}<br></div>`;
        }
        replyHeader += `<div>${i18NProviderUtils.getI18NValue(
          'crm.events.date'
        )}: ${contHeaderDate} ${offset} <br></div><div>${i18NProviderUtils.getI18NValue(
          'crm.label.subject'
        )}: ${encodeForHtml(
          ticket.subject
        )}<br></div><div>============ ${i18NProviderUtils.getI18NValue(
          'support.mail.header.forwarded.message'
        )} ============<br></div></div><br>`;
      } else if (replyMode !== 'forward') {
        replyHeader = `<div><br>---- ${i18NProviderUtils.getI18NValue(
          'support.on'
        )} ${contHeaderDate} ${offset} <b> ${encodeForHtml(
          fromAddress
        )} </b> ${i18NProviderUtils.getI18NValue(
          'suppot.mail.header.wrote'
        )} ---- <br></div>`;
      }
    }
    return replyHeader;
  } /*need*/

  render() {
    const {
      editorId,
      replyContent,
      replyThread,
      replyMode,
      orgName,
      orgId,
      openEditor,
      signatureObj = {},
      linkHolder,
      solutionContent,
      isDraftThread,
      replyingUsers,
      agents,
      ticketId,
      isPeekView,
      haveMailSendPermission,
      channelRelatedInfo = {},
      mailConfigurations,
      myInfo,
      isStatusLocked,
      isFromBlueprint,
      isCloudAttchOpen,
      haveForWardPermissionOnly,
      isSharedTicket,
      uploadInlineAttach,
      fromAddress,
      isCustomChannel,
      channelInfo = {},
      changeForumStatus,
      showMessage,
      deptId,
      depName,
      isTicketReplying,
      customClass,
      isSaveDraft,
      isSingleUpdatePopupShow,
      isSingleUpdateFrom,
      moduleMeta,
      isBpTransDraft = false,
      haveCloseTicketPermission,
      isAdminUser,
      searchAvailableFields,
      searchContacts,
      currentUserId,
      haveEditPermission,
      isMassReply,
      editorBorder,
      isCloudAttachmentSupported,
      isSendImmediatelyNeed,
      isScheduleReplyEnabled,
    } = this.props;
    const {
      newAttachments,
      oldAttachments,
      draftText,
      toAddress,
      ccAddress,
      bccAddress,
      searchMode,
      searchData,
      isRecipientsVisible,
      isPrivateThread,
      haveVisibilityChangePer,
      isPrivateButtonEnable,
      inValideArr,
      isSnippetActionOpen,
      isCLoudOpen,
      changeEditorContent,
      isEditorFocus,
      isFromAddressFetching,
      isToEmpty,
      isCcInvalid,
      isBccInvalid,
      alertMode,
      previewObj,
      snippetDataMode,
      selectedFromAddress,
      isAutoDraft,
      contentModified,
      isDeleteDraftActive,
      isAttachmentViewerActive,
      isSnippetActive,
      isEmailTemplateActive,
      isCCRemovalAlertActive,
      removableCCs,
      sameThreadUsers,
      isDrafting,
      showSchedulePopup,
      showTimeExpiryConfirmation,
      isScheduleTimeActive,
      isScheduling,
      isScheduleActive,
      isReplying,
    } = this.state;

    const { direction } = this.context || {};
    const isDraft = replyThread && replyThread.status === 'DRAFT';
    const isForumTopicDeleted =
      channelRelatedInfo !== null && channelRelatedInfo.isTopicDeleted;
    const isForumReply = replyMode === 'forum' && !isForumTopicDeleted;
    let isModerator = false;
    if (!isAdminUser && replyMode == 'forum' && channelRelatedInfo.moderators) {
      isModerator = checkIsModerator(
        channelRelatedInfo.moderators,
        currentUserId
      );
    }
    const { replyConfig = {}, appName } = channelInfo;
    const showAttachments = isCustomChannel
      ? (replyConfig && replyConfig.acceptsAttachments) || false
      : true;
    let includeQuoted = true;
    let defaultContentType;
    if (isCustomChannel) {
      const { contentTypes, includeQuotedMessage } = replyConfig;
      if (!contentTypes.includes('text/html')) {
        defaultContentType = 'plaintext';
      }
      includeQuoted = includeQuotedMessage;
    }

    let content = replyContent || '';

    if (!isDraft) {
      if (content !== '<html><body><div></div></body></html>') {
        if (
          replyThread &&
          (replyThread.channel === 'TWILIO' ||
            replyThread.channel === 'TELEPHONY') &&
          replyThread.content &&
          checkIsJSON(replyThread.content)
        ) {
          content = ReactDOMServer.renderToStaticMarkup(
            <AudioMessage thread={replyThread} orgId={orgId} />
          );
        }
        const replyHeader = !contentModified ? this.constructReplyHeader() : '';
        content =
          includeQuoted && content.trim() !== ''
            ? `${replyHeader}${BEFORE_QUOTE_CONTENT}<div><blockquote spellcheck="false" style="border-left: 1px dotted #e5e5e5;margin-left:5px;padding-left: 5px;"><div>${content}</div></blockquote></div>`
            : '<div><br></div>';
      }

      if (isForumReply) {
        content = '';
      }
      const {
        isActive,
        defaultSignature,
        customizedSignatures = [],
      } = signatureObj;
      let signature = '';
      if (isActive) {
        signature = defaultSignature || '';
        customizedSignatures.forEach((customizedSignature) => {
          const { departmentId, signature: cSignature } = customizedSignature;
          if (deptId === departmentId) {
            signature = cSignature || '';
          }
        });
      }
      const isRTL = direction === 'rtl';
      const needLinkHolder =
        linkHolder && replyMode !== 'forward' && !isForumReply && includeQuoted;

      signature = updateSurveyLink(
        needLinkHolder,
        signature,
        linkHolder,
        isRTL
      );

      if (signature) {
        signature = `${SIGN_START}<div>${signature}</div>${SIGN_END}`;
        content = `<div><br></div><div><br></div>${signature}${content}`;
      }
    }

    if (typeof solutionContent === 'string') {
      content = solutionContent + content;
    }

    const editorBorderType = editorBorder
      ? editorBorder
      : isForumReply
      ? 'borderNone'
      : 'borderTop';

    return (
      <div
        className={`${
          isFromBlueprint
            ? style.wrapper
            : !isMassReply
            ? style.detailwrapper
            : ''
        } ${customClass} `}
      >
        <Container className={isFromBlueprint ? '' : style.parent}>
          {!isForumReply && !isMassReply ? (
            <Box>
              <Composebox
                updateMode={this.updateMode}
                getWrapperCompState={this.getWrapperCompState}
                searchContact={searchContacts}
                searchAvailableFields={searchAvailableFields}
                mode={replyMode}
                saveDraft={this.saveDraft}
                updateDraft={this.updateDraft}
                toAddress={toAddress}
                bccAddress={bccAddress}
                ccAddress={ccAddress}
                isDraft={isDraft}
                draftText={draftText}
                addEmail={this.addEmail}
                changeEmail={this.changeEmail}
                removeEmail={this.removeEmail}
                fromEmailAddress={fromAddress}
                isFromAddressFetching={isFromAddressFetching}
                changeFromEmailAddress={this.changeFromEmailAddress}
                deleteDraft={this.deleteDraftConfirmation}
                openEditor={openEditor}
                threadId={editorId}
                content={replyContent}
                thread={replyThread}
                searchMode={searchMode}
                searchData={searchData}
                orgName={orgName}
                closeSearchPopup={this.closeSearchPopup}
                isRecipientsVisible={isRecipientsVisible}
                hideRecipients={this.hideRecipients}
                inValideArr={inValideArr}
                isPeekView={isPeekView}
                getFromEmailAddress={this.getFromEmailAddress}
                haveMailSendPermission={haveMailSendPermission}
                mailConfigurations={mailConfigurations}
                myInfo={myInfo}
                isFromBlueprint={isFromBlueprint}
                haveForWardPermissionOnly={haveForWardPermissionOnly}
                isEditorFocus={isEditorFocus}
                isToEmpty={isToEmpty}
                isCcInvalid={isCcInvalid}
                isBccInvalid={isBccInvalid}
                isCustomChannel={isCustomChannel}
                depName={depName}
                selectedFromAddress={selectedFromAddress}
                reOrderEmail={this.reOrderEmail}
                moveEmail={this.moveEmail}
                toCompRef={this.toCompRef}
                ccCompRef={this.ccCompRef}
                bccCompRef={this.bccCompRef}
                focusTo={this.focusTo}
              />
            </Box>
          ) : null}
          <Box tabindex="-1">
            {isForumReply && !isMassReply ? (
              !isFromBlueprint && (
                <ForumFooter
                  ticketId={ticketId}
                  changeForumStatus={changeForumStatus}
                  closeEdtior={this.closeEditor}
                  saveDraft={this.saveDraft}
                  updateDraft={this.updateDraft}
                  deleteDraft={this.deleteDraftConfirmation}
                  isDraft={isDraftThread}
                  sendReply={this.sendReply}
                  channelRelatedInfo={channelRelatedInfo}
                  haveMailSendPermission={haveMailSendPermission}
                  isPeekView={isPeekView}
                  draftText={draftText}
                  isAutoDraft={isAutoDraft}
                  isTicketReplying={isTicketReplying}
                  haveSetForumStatusPermission={isAdminUser || isModerator}
                />
              )
            ) : (
              <ReplyFooter
                isFromBlueprint={isFromBlueprint}
                closeEdtior={() => {
                  this.closeEditor();
                  if (isScheduleActive && isScheduleTimeActive) {
                    this.updateScheduleDetails(null, null, false);
                  }
                }}
                uploadAttach={this.uploadAttach}
                showAttachmentViewer={this.showAttachmentViewer}
                openCloudAttach={this.openCloudAttach}
                closeCloudAttach={this.closeCloudAttach}
                orgId={orgId}
                newAttachments={newAttachments}
                oldAttachments={oldAttachments}
                removeAttachment={this.removeAttachment}
                sendDraft={this.sendDraft}
                sendImmediately={this.sendImmediately}
                isDraft={isDraft}
                sendReply={this.sendReply}
                sendAndClose={this.sendAndClose}
                isPrivateThread={isPrivateThread}
                haveVisibilityChangePer={haveVisibilityChangePer}
                isPrivateButtonEnable={isPrivateButtonEnable}
                togglePrivateSwitch={this.togglePrivateSwitch}
                isPeekView={isPeekView}
                haveMailSendPermission={haveMailSendPermission}
                isStatusLocked={isStatusLocked}
                sendForReview={this.sendForReview}
                isCloudAttchOpen={isCloudAttchOpen && isCLoudOpen}
                CloudAttachmentIframe={AsyncCloudAttachmentIframe}
                showMessage={showMessage}
                addCloudAttch={this.addCloudAttch}
                haveForWardPermissionOnly={haveForWardPermissionOnly}
                isSharedTicket={isSharedTicket}
                isCustomChannel={isCustomChannel}
                acceptsAttachments={showAttachments}
                appName={appName}
                deleteDraft={this.deleteDraftConfirmation}
                sendCusomChannelReply={this.sendCusomChannelReply}
                isLoading={isReplying || isTicketReplying}
                defaultSendBehavior={myInfo.defaultSendBehavior}
                haveCloseTicketPermission={haveCloseTicketPermission}
                isDrafting={isDrafting}
                isMassReply={isMassReply}
                isCloudAttachmentSupported={isCloudAttachmentSupported}
                scheduleInfo={replyThread && replyThread.scheduleInfo}
                isSendImmediatelyNeed={
                  isSendImmediatelyNeed &&
                  replyThread &&
                  replyThread.scheduleInfo &&
                  isScheduleActive
                }
                isScheduleReplyEnabled={
                  isScheduleReplyEnabled
                } /*for custom scheduling case*/
                toggleSchedulePopup={this.toggleSchedulePopup}
                isScheduleActive={isScheduleActive}
                isContinueScheduleNeeded={
                  replyThread && replyThread.scheduleInfo && isScheduleActive
                }
                handleContinueSchedule={this.onContinueSchedule}
              />
            )}
          </Box>
        </Container>
      </div>
    );
  }
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
