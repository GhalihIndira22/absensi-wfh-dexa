// services/worker/types/log.types.ts

export interface LogPayload {
    employee_id: number;
    email: string;
    field: string;
    oldValue: string;
    newValue: string;
    timestamp: string;
    change_type: string;
}
