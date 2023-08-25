export default class Thread {
  constructor(
    readonly to: string,
    readonly cc: String,
    readonly from: string,
    readonly fromEmailAddress: string,
    readonly phoneno: string,
    readonly channel: string,
    readonly author: string
  ) {
    this.to = to;
    this.cc = cc;
    this.from = from;
    this.fromEmailAddress = fromEmailAddress;
    this.phoneno = phoneno;
    this.channel = channel;
    this.author = author;
  }

  get properties() {
    return {
      to: this.to,
      cc: this.cc,
      from: this.from,
      fromEmailAddress: this.fromEmailAddress,
    };
  }
}
