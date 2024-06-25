import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(private userRepository: UserRepository) {}

  async createUser(user: User) {
    return this.userRepository.createUser(user);
  }

  findAll() {
    return this.userRepository.getUsers();
  }

  findOne(id: string) {
    return this.userRepository.getUserById(id);
  }

  update(id: string, userUpdate: User) {
    return this.userRepository.updateUser(id, userUpdate);
  }

  remove(id: string) {
    return this.userRepository.deleteUser(id);
  }
}
