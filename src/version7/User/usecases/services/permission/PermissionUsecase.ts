import User from '../../../../User/domain/User';
import { Reply } from '../../model/Reply';
import { UserRepository } from '../../repository/UserRepository';

export class PermissionUsecase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(replyInput: Reply): Promise<boolean> {
    const user = await this.userRepo.getCurrentUser();

    return ishaveMailSendPermission(user);
  }
}

const ishaveMailSendPermission = (user: User) => {
  if (!user.ishaveMailSendPermission()) {
    throw new Error('No Permission');
  }
  return true;
};
