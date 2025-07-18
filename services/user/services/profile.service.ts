import { PrismaClient } from '@prisma/client';
import { UpdateProfileDto } from '../dto/update-profile.dto';

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

export const updateProfile = async (id: number, input: UpdateProfileDto) => {
    const updates: Partial<UpdateProfileDto & { passwordHash?: string }> = {};
    const changes: any[] = [];

    if (input.name) {
        updates.name = input.name;
        changes.push({ type: 'name', newValue: input.name });
    }
    if (input.position) {
        updates.position = input.position;
        changes.push({ type: 'position', newValue: input.position });
    }
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

