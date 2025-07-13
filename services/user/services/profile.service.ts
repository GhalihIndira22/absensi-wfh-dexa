import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ProfileUpdateInput = {
    photoUrl?: string;
    phoneNumber?: string;
    password?: string;
};

export const findUserById = async (id: number) => {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            position: true,
            photoUrl: true,
            phoneNumber: true,
        },
    });
};

export const updateProfile = async (id: number, input: ProfileUpdateInput) => {
    const updates: any = {};
    const changes: any[] = [];

    if (input.photoUrl) {
        updates.photoUrl = input.photoUrl;
        changes.push({ type: 'photo', newValue: input.photoUrl });
    }

    if (input.phoneNumber) {
        updates.phoneNumber = input.phoneNumber;
        changes.push({ type: 'phone_number', newValue: input.phoneNumber });
    }

    if (input.password) {
        const bcrypt = await import('bcrypt');
        updates.passwordHash = await bcrypt.hash(input.password, 10);
        changes.push({ type: 'password', newValue: '*****' });
    }

    const userBefore = await prisma.user.findUnique({ where: { id } });

    await prisma.user.update({
        where: { id },
        data: updates
    });

    return { userBefore, changes };
};

