import { Pool } from 'pg';
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + '?sslmode=require',
});

pool.connect((err) => {
  if (err) throw err;
  console.log('Connected to PostgreSQL successfully!');
});

export default pool;
