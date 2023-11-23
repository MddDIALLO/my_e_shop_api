export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role_id: number;
    created_by: number;
    updated_by: number;
    created_date: Date;
    updated_date: Date;
}