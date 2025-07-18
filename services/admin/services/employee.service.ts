import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import {CreateEmployeeDto} from '../dto/employee.dto';
import {UpdateEmployeeDto} from '../dto/update-employee.dto';
import { UserRole } from '../dto/user-role.enum';

const prisma = new PrismaClient();

export const createEmployeeService = async (createEmployeeRequestDto: CreateEmployeeDto) => {
    console.log('[createEmployeeService] Input:', createEmployeeRequestDto);
    const { email, name, position, phoneNumber, password } = createEmployeeRequestDto;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log('[createEmployeeService] Email already registered:', email);
        throw new Error('Email already registered');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            email,
            name,
            position,
            phoneNumber,
            passwordHash,
            role: UserRole.EMPLOYEE
        }
    });
    console.log('[createEmployeeService] Created user:', { id: newUser.id, email: newUser.email });
    return newUser;
};

export const getAllEmployeesService = async (query: any) => {
    console.log('[getAllEmployeesService] Query:', query);
    const { email, includeInactive, page = '1', pageSize = '10' } = query;
    const includeInactiveBool = includeInactive === 'true';
    const pageNumber = Math.max(Number(page), 1);
    const size = Math.max(Number(pageSize), 1);
    const skip = (pageNumber - 1) * size;
    const where: any = {
        role: UserRole.EMPLOYEE,
        ...(includeInactiveBool ? {} : { isActive: true }),
        ...(email && {
            email: {
                contains: email as string,
                mode: 'insensitive'
            }
        })
    };
    const [employees, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                position: true,
                phoneNumber: true,
                photoUrl: true,
                isActive: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip,
            take: size
        }),
        prisma.user.count({ where })
    ]);
    const result = {
        data: employees,
        page: pageNumber,
        pageSize: size,
        total,
        totalPages: Math.ceil(total / size)
    };
    console.log('[getAllEmployeesService] Result:', result);
    return result;
};

export const updateEmployeeService = async (id: number, data: UpdateEmployeeDto) => {
    console.log('[updateEmployeeService] id:', id, 'Input:', data);
    const updates: Partial<UpdateEmployeeDto & { passwordHash?: string; photoUrl?: string }> = {};
    if (data.name) updates.name = data.name;
    if (data.position) updates.position = data.position;
    if (data.phoneNumber) updates.phoneNumber = data.phoneNumber;
    if (data.photoUrl) updates.photoUrl = data.photoUrl;
    if (data.password) {
        updates.passwordHash = await bcrypt.hash(data.password, 10);
    }
    const updated = await prisma.user.update({
        where: {id: Number(id)},
        data: updates
    });
    console.log('[updateEmployeeService] Updated user : ,', {id: updated.id, email: updated.email});
};

export const deleteEmployeeService = async (id: number) => {
    console.log('[deleteEmployeeService] id:', id);
    const target = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!target) {
        console.log('[deleteEmployeeService] Employee not found:', id);
        throw new Error('Employee not found');
    }
    if (target.role === UserRole.ADMIN) {
        console.log('[deleteEmployeeService] Cannot delete admin account:', id);
        throw new Error('Cannot delete admin account');
    }
    await prisma.user.update({
        where: { id: Number(id) },
        data: { isActive: false }
    });
    console.log('[deleteEmployeeService] Soft-deleted employee:', id);
    return { id };
};

