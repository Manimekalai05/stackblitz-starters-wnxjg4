import Thread from '../Domain/Thread';

export default class Ticket {
  constructor(
    readonly id: string,
    readonly subject: string,
    readonly description: string,
    readonly email: string,
    readonly content: string,
    readonly thread: Thread
  ) {
    this.id = id;
    this.subject = subject;
    this.email = email;
    this.content = content;
    this.description = description;
  }

  get properties() {
    return {
      id: this.id,
      subject: this.subject,
      email: this.email,
      content: this.content,
      thread: this.thread.properties,
      description: this.description,
    };
  }
}
