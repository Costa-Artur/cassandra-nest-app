import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './user.repository';
import { CassandraModule } from '../common/cassandra/cassandra.module';

@Module({
  controllers: [UsersController],
  imports: [CassandraModule],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
