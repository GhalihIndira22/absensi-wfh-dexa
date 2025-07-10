import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const existing = await prisma.user.findFirst({
        where: { email: 'employee@company.com' },
    });

    if (existing) {
        console.log('🚫 User already exists, skipping seed');
        return;
    }

    const passwordHash = await bcrypt.hash('password123', 10);

    await prisma.user.create({
        data: {
            email: 'employee@company.com',
            name: 'John Doe',
            position: 'Staff Engineer',
            phoneNumber: '081234567890',
            photoUrl: 'https://i.pravatar.cc/300',
            passwordHash,
            role: 'employee',
        },
    });

    console.log('✅ Seed user created');
}

main()
    .catch((e) => {
        console.error('❌ Error during seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
