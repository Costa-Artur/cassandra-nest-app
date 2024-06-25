import { Injectable, OnModuleInit } from '@nestjs/common';
import { mapping } from 'cassandra-driver';
import { User } from './entities/user.entity';
import { CassandraService } from '../common/cassandra/cassandra.service';

@Injectable()
export class UserRepository implements OnModuleInit {
  private userMapper: mapping.ModelMapper<User>;

  constructor(private cassandraService: CassandraService) {}

  async onModuleInit() {
    await this.cassandraService.onModuleInit();
    const client = this.cassandraService.getClientInstance();
    const mappingOptions: mapping.MappingOptions = {
      models: {
        'User': {
          tables: ['users'],
          mappings: new mapping.UnderscoreCqlToCamelCaseMappings()
        }
      }
    };

    this.userMapper = new mapping.Mapper(client, mappingOptions).forModel('User');
  }

  async getUsers() {
    return await this.userMapper.findAll();
  }

  async getUserById(id: string) {
    return await this.userMapper.find({ userId: id });
  }

  async createUser(user: User) {
    return await this.userMapper.insert(user);
  }

  async updateUser(id: string, user: User) {
    const userToUpdate = new User();
    Object.assign(userToUpdate, user); // Copy properties from `user` to `userToUpdate`
    return await this.userMapper.update(userToUpdate);
  }

  async deleteUser(id: string) {
    return await this.userMapper.remove({ userId: id });
  }
}
