import path from 'path';
import { createConnection } from 'typeorm';

export default createConnection({
  type: 'postgres',
  url:
    (process.env.DATABASE_URL as string)
    || 'postgres://postgres:postgres@localhost:5432/costs',
  entities: [path.resolve(__dirname, '..', 'models/**/*')],
  synchronize: true,
  logging: [process.env.NODE_ENV === 'production' ? 'info' : 'error'],
});
