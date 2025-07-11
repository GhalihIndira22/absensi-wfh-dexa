import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const saveLog = async (data: {
    employee_id: number;
    change_type: string;
    old_value: string;
    new_value: string;
    changed_at: string;
}) => {
    await prisma.profileChangeLog.create({
        data: {
            employeeId: data.employee_id,
            changeType: data.change_type,
            oldValue: data.old_value,
            newValue: data.new_value,
            changedAt: new Date(data.changed_at)
        }
    });
};
