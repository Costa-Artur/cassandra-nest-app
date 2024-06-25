import { Injectable, OnModuleInit } from "@nestjs/common";
import { Client, auth, mapping } from "cassandra-driver";

@Injectable()
export class CassandraService implements OnModuleInit {
  private client: Client;
  private keyspace = 'fichasdb';
  private initialized: Promise<void>;

  constructor() {
    this.initialized = this.createClient();
  }

  async onModuleInit() {
    await this.initialized;
  }

  private async createClient() {
    this.client = new Client({
      contactPoints: ['0.0.0.0'],
      keyspace: 'system', // Use 'system' keyspace temporarily for initial connection
      localDataCenter: 'datacenter1',
      authProvider: new auth.PlainTextAuthProvider('admin', 'admin')
    });

    try {
      await this.client.connect();
      console.log('Connected to Cassandra');
      await this.createKeyspace();
      await this.client.execute(`USE ${this.keyspace}`);
      await this.dropTable("users");
      await this.createTable();
    } catch (err) {
      console.error('Error connecting to Cassandra', err);
      throw err;
    }
  }

  private async createKeyspace() {
    const createKeyspaceCql = `
      CREATE KEYSPACE IF NOT EXISTS ${this.keyspace}
      WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
    `;

    try {
      await this.client.execute(createKeyspaceCql);
      console.log(`Keyspace "${this.keyspace}" created (if it did not exist)`);
    } catch (err) {
      console.error(`Error creating keyspace "${this.keyspace}"`, err);
      throw err;
    }
  }

  async dropTable(tableName: string) {
    try {
      const dropTableCql = `DROP TABLE IF EXISTS ${tableName};`;
      await this.client.execute(dropTableCql);
      console.log(`Table "${tableName}" dropped (if it existed)`);
    } catch (err) {
      console.error(`Error dropping table "${tableName}"`, err);
      throw err;
    }
  }

  private async createTable() {
    const createTableCql = `
      CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY,
        username TEXT,
        email TEXT,
        password TEXT
      );
    `;

    try {
      await this.client.execute(createTableCql);
      console.log('Table "users" created (if it did not exist)');
    } catch (err) {
      console.error('Error creating table "users"', err);
      throw err;
    }
  }

  createMapper(mappingOptions: mapping.MappingOptions) {
    if (!this.client) {
      throw new Error('Cassandra client is not initialized');
    }
    return new mapping.Mapper(this.client, mappingOptions);
  }

  getClientInstance(): Client {
    return this.client;
  }
}
