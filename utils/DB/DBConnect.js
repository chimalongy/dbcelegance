// import { Pool } from "pg";

// // const pool = new Pool({
// //   user: 'postgres',
// //   host: 'localhost',
// //   database: 'dbcelegance',
// //   password: '1',
// //   port: 5432,
// // })

// const pool = new Pool({

//   port: 5432,
//   host: "aws-0-eu-north-1.pooler.supabase.com",
//   database: "postgres",
//   user: "postgres.mwybgicbeqwphroaerpy",
//   pool_mode: "session",
//   password:"chimsyboy"
// });
// export default pool;

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Supabase requires SSL
});

export default pool;
