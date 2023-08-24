import Ticket from '../Domain/Ticket';
import { Reply } from '../usescases/model/Reply';
import { DraftRepository } from '../usescases/repository/DraftRepository';
import ApiReply from './Http/ApiReply';

class DraftResource implements DraftRepository {
  constructor(
    private readonly restClient: RestClient,
    private readonly store: ReplyActionStore
  ) {}

  async sendReply(replyModel: Reply): Promise<Ticket> {
    const content = replyModel.content;
    const channel = replyModel.channel;
    const data = { channel, content };
    const toDomain = (res) => ApiReply.fromProperties(res).toDomain();
    const callApiFunc = this.restClient.sendReply(data, toDomain);

    return ticket;
  }
}

export default ReplyActionResource;
