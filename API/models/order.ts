export interface Order {
    id: number;
    user_id: number;
    status: string;
    created_date: Date;
    updated_date: Date;
    total_cost: number;
}