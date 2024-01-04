export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
    created_by: number;
    updated_by: number;
    created_date: Date;
    updated_date: Date;
    image_url: string;
    isActive: boolean;
}