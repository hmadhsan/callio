import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testLogin() {
    const email = 'hammadhassan616@gmail.com';

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        console.log("User found:", user ? "Yes" : "No");

        if (user) {
            console.log("Password hash present:", !!user.password);
        }
    } catch (e) {
        console.error("Login crashed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

testLogin();
