"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
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
const pool = new pg_1.Pool({
    connectionString: process.env.POSTGRES_URL + '?sslmode=require',
});
pool.connect((err) => {
    if (err)
        throw err;
    console.log('Connected to PostgreSQL successfully!');
});
exports.default = pool;
//# sourceMappingURL=index.js.map