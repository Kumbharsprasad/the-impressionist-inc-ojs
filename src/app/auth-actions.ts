'use server'

import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { login, logout } from '@/lib/auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

// --- Auth Actions ---

const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['admin', 'editor', 'author', 'reviewer']).default('author'),
});

export async function register(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    console.log("Registering:", data);
    const validated = RegisterSchema.safeParse(data);

    if (!validated.success) {
        return { error: 'Invalid fields', details: validated.error.flatten() };
    }

    const { name, email, password, role } = validated.data;
    const hash = await bcrypt.hash(password, 10);

    try {
        const newUser = await db.insert(users).values({
            name,
            email,
            passwordHash: hash,
            role: role as any,
        }).returning({ id: users.id, name: users.name, role: users.role, email: users.email });

        const user = newUser[0];
        await login(user);

        // Success redirect happens via redirect() which throws
    } catch (error) {
        console.error(error);
        if ((error as any).code === '23505') { // Postgres duplicate
            return { error: 'Email already exists' };
        }
        return { error: 'Database error' };
    }

    redirect('/dashboard');
}

export async function loginAction(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const email = data.email as string;
    const password = data.password as string;

    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (userResult.length === 0) {
        return { error: 'Invalid credentials' };
    }

    const user = userResult[0];
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
        return { error: 'Invalid credentials' };
    }

    await login({ id: user.id, name: user.name, email: user.email, role: user.role });
    redirect('/dashboard');
}

export async function logoutAction() {
    await logout();
    redirect('/');
}

export async function forgotPasswordAction(formData: FormData) {
    const email = formData.get('email') as string;

    // In a real app, we'd send a secure reset link via email.
    // For this prototype, we'll verify the email and simulate the transaction.
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (userResult.length === 0) {
        // Security best practice: don't reveal if account exists.
        // But for this project, let's provide clear feedback.
        return { error: 'No intelligence record found for this email address.' };
    }

    // Simulate sending email
    console.log(`[AUTH] Password reset requested for: ${email}`);
    return { success: true };
}
