import { Module } from "@nestjs/common";
import { CassandraService } from "./cassandra.service";

@Module({
  providers: [CassandraService],
  exports: [CassandraService], // Export CassandraService to be used in other modules
})
export class CassandraModule {}
