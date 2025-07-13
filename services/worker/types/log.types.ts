// services/worker/types/log.types.ts

export interface LogPayload {
    employeeId: number;
    email: string;
    field: string;
    oldValue: string;
    newValue: string;
    timestamp: string;
}
