import { Reply } from '../model/Reply';
import NotificationBoundary from '../repository/NotificationBoundary';
import { UserRepository } from '../repository/UserRepository';
import { UserServiceBoundary } from '../repository/UserServiceBoundary';
import { IsModeratorUsecase } from './permission/IsModeratorUsecase';
import { PermissionUsecase } from './permission/PermissionUsecase';

export default class ReplyServices implements UserServiceBoundary {
  constructor(
    protected userRepo: UserRepository,
    protected notifyService: NotificationBoundary
  ) {}

  public async isModerator(replyInput: Reply): Promise<boolean> {
    return new IsModeratorUsecase(this.userRepo).execute(replyInput);
  }

  public async isHaveMailSendPermission(replyInput: Reply): Promise<boolean> {
    return new PermissionUsecase(this.userRepo).execute(replyInput);
  }
}
