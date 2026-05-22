import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/ojs_db';
// Parse the URL to get credentials but switch db to 'postgres'
const urlObj = new URL(dbUrl);
urlObj.pathname = 'postgres'; // Connect to default db
const adminUrl = urlObj.toString();

async function main() {
    console.log('Connecting to administrative database...');
    const sql = postgres(adminUrl);

    try {
        console.log("Checking if database 'ojs_db' exists...");
        const result = await sql`SELECT 1 FROM pg_database WHERE datname = 'ojs_db'`;

        if (result.length === 0) {
            console.log("Database 'ojs_db' does not exist. Creating...");
            await sql`CREATE DATABASE ojs_db`;
            console.log("Database 'ojs_db' created successfully!");
        } else {
            console.log("Database 'ojs_db' already exists.");
        }
    } catch (error) {
        console.error("Error creating database:", error);
        console.log("Please manually create the database 'ojs_db' in your PostgreSQL setup if this failed.");
    } finally {
        await sql.end();
    }
}

main();
