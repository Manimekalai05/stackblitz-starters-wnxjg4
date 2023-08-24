import { IsModeratorUsecase } from '../usecases/services/permission/IsModeratorUsecase';

export default class User {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly role: string,
    readonly channelRelatedInfo: channelRelatedInfo,
    readonly moderator: moderator
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }

  get properties() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }

  isModerator() : boolean{
    return (
      !this.isAdminUser &&
      this.channelRelatedInfo.moderators &&
      this.checkIsModerator()
    );
  }
  isAdminUser() {}
  checkIsModerator(){
    let list;
    if(this.moderator.length  == 0){
      return false
    }
    else{
      list  = this.moderator.filter((data)=>{
        return data.id == this.id;
      });
      return list.length ? true : false;
    }
  
}
