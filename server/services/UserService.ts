import { User } from '../models/User';

class UserService {
  public static getAll() {
    return User.find();
  }
}

export default UserService;
