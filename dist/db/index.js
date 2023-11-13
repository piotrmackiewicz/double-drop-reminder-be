"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
require('dotenv').config();
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