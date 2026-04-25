import mysql from 'mysql2/promise'

// Using connection pool instead of single connection
// to improve performance by reusing connections and handling concurrent queries efficiently
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

export default db