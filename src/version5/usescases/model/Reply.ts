import Ticket from "../../Domain/Ticket";

export class Reply {
  private constructor(
    readonly id: string,
    readonly subject: string,
    readonly description: string,
    readonly content: string,
    readonly channel: string,
    readonly errormessage: string
  ) {}

  static fromDomain(ticket: Ticket,errormessage: string) {
    const { id, subject, description } = ticket.properties;
    return new Reply(id, subject, description, errormessage);
  }
  static fromError(errormessage: string) {
    return new Reply(null, null, null, errormessage);
  }

  static fromProperties({id,content}){
    return new Reply(id,null,null,content,null,null)
  }
  }
}
