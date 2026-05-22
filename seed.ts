import { db } from './src/db/index';
import { users } from './src/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
    console.log('Seeding database with test credentials...');

    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const testUsers = [
        {
            name: 'Admin User',
            email: 'admin@ojs.com',
            passwordHash: hashedPassword,
            role: 'admin' as const,
        },
        {
            name: 'Chief Editor',
            email: 'editor@ojs.com',
            passwordHash: hashedPassword,
            role: 'editor' as const,
        },
        {
            name: 'Dr. John Author',
            email: 'author@ojs.com',
            passwordHash: hashedPassword,
            role: 'author' as const,
        },
        {
            name: 'Prof. Jane Reviewer',
            email: 'reviewer@ojs.com',
            passwordHash: hashedPassword,
            role: 'reviewer' as const,
        },
        {
            name: 'Dr. Alan Reviewer',
            email: 'reviewer2@ojs.com',
            passwordHash: hashedPassword,
            role: 'reviewer' as const,
        },
    ];

    for (const user of testUsers) {
        try {
            const existing = await db.select().from(users).where(eq(users.email, user.email));
            if (existing.length === 0) {
                await db.insert(users).values(user);
                console.log(`Created user: ${user.email}`);
            } else {
                console.log(`User already exists: ${user.email}`);
            }
        } catch (e) {
            console.error(`Failed to seed user ${user.email}:`, e);
        }
    }

    console.log('Seeding complete!');
    process.exit(0);
}

seed();
