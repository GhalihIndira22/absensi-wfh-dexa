import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('admin123', 10);

    await prisma.user.upsert({
        where: { email: 'admin@company.com' },
        update: {},
        create: {
            email: 'admin@company.com',
            name: 'Admin HRD',
            position: 'HRD',
            phoneNumber: '081234567890',
            photoUrl: '',
            passwordHash: password,
            role: 'admin'
        }
    });

    console.log('✅ Admin user created');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
