import { Reply } from '../../usescases/model/Reply';
import NotificationBoundary from '../../usescases/repository/NotificationBoundary';

export class ForumNotificationServices implements NotificationBoundary {
  constructor(private readonly messageServices,
    private readonly murphytool){
      
    }
  notifyError: (Replyoutput: Reply) {
    this.messageServices.showError(Replyoutput.errormessage);
    this.murphytool.pushError(Replyoutput.errormessage);

  }
}
