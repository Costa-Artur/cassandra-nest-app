import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { CassandraService } from './modules/common/cassandra/cassandra.service';
import { UsersService } from './modules/users/users.service';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService, CassandraService, UsersService],
  exports: [CassandraService]
})
export class AppModule {}
