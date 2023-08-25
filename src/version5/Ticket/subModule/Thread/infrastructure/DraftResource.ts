import Ticket from '../Domain/Ticket';
import { Reply } from '../usescases/model/Reply';
import { DraftRepository } from '../usescases/repository/DraftRepository';
import ApiReply from './Http/ApiReply';

class DraftResource implements DraftRepository {
  constructor(
    private readonly restClient: RestClient,
    private readonly store: ReplyStore
  ) {}

  async saveDraft(replyModel: Reply): Promise<Ticket> {
    const content = replyModel.content;
    const channel = replyModel.channel;
    const data = { channel, content };
    const ticket = '';
    const toDomain = (res) => ApiReply.fromProperties(res).toDomain();
    const callApiFunc = this.restClient.saveDraft(data, toDomain);
    this.store.saveDraft(data, callApiFunc);
    return ticket;
  }
}

export default ReplyActionResource;
