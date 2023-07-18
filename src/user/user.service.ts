import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'test',
      password: 'postgres',
      port: '5432',
    });
  }

  async getUserByName(name: string): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE name = $1', [name]);
      if (result.rows.length > 0) {
        return result.rows[0];
      }
      return null;
    } finally {
      client.release();
    }
  }

  async createUser(user: any): Promise<any> {
    const hashedPassword = await hash(user.password, 10);
    const client = await this.pool.connect();
    try {
      const query = 'INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *';
      const values = [user.name, hashedPassword];
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}
