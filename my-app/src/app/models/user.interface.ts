export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  image_url: string;
  isActive: boolean;
}

export interface UserTable {
  id: number;
  username: string;
  email: string;
  role: string;
  created_date: Date | null;
  updated_date: Date | null;
  image_url: string;
  isActive: boolean;
}

export interface UsersData {
  message: string;
  result: UserTable[];
}
