import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userId = 3;
    const baseDate = new Date('2025-07-01');

    for (let i = 0; i < 9; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);

        const masuk = new Date(date);
        masuk.setHours(8, 0, 0, 0);

        const pulang = new Date(date);
        pulang.setHours(17, 0, 0, 0);

        await prisma.attendance.createMany({
            data: [
                {
                    userId,
                    type: 'masuk',
                    timestamp: masuk,
                    createdAt: masuk
                },
                {
                    userId,
                    type: 'pulang',
                    timestamp: pulang,
                    createdAt: pulang
                }
            ]
        });
    }

    console.log('✅ Dummy attendance seeded from July 1 to July 9, 2025');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
