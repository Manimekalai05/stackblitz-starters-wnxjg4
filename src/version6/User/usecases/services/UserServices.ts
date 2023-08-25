import { Reply } from '../model/Reply';
import NotificationBoundary from '../repository/NotificationBoundary';
import { UserRepository } from '../repository/UserRepository';
import { UserServiceBoundary } from '../repository/UserServiceBoundary';
import { IsModeratorUsecase } from './permission/IsModeratorUsecase';
import { ForumPermissionUsecase } from './permission/ForumPermissionUsecase';

export default class UserServices implements UserServiceBoundary {
  constructor(
    protected userRepo: UserRepository,
    protected notifyService: NotificationBoundary
  ) {}

  public async isModerator(replyInput: Reply): Promise<boolean> {
    return new IsModeratorUsecase(this.userRepo).execute(replyInput);
  }

  public async isHaveForumPermission(replyInput: Reply): Promise<boolean> {
    return new ForumPermissionUsecase(this.userRepo).execute(replyInput);
  }
}
