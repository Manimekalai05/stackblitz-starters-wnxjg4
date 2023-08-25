import { Reply } from '../model/Reply';

export default interface NotificationBoundary {
  notifySuccess: (Replyoutput: Reply) => void;
  notifyError: (Replyoutput: Reply) => void;
}
