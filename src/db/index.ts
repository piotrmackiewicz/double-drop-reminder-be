import { Pool } from 'pg';
require('dotenv').config();

// export default async () => {
//   const db = new Client({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: Number(process.env.DB_PORT),
//   });

//   await db.connect();

//   return db;
// };

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + '?sslmode=require',
});

pool.connect((err) => {
  if (err) throw err;
  console.log('Connected to PostgreSQL successfully!');
});

export default pool;
