export class ReplyClient {
  public async sendReply(data:object, callback:function) {
    return (state, getState) =>
      requestAPI(`/api/v1/tickets/${id}/draftReply`, false, {
        orgId: state.currentOrgId,
        featureFlags: 'downloadAttachUDS,scheduledReply',
      })
        .post('', data)
        .then((res) => callback(res));
  }
}
