import { UserTable } from "./user.interface";

export interface Rep {
  message: string;
  token: string;
  connectedUser: UserTable;
}

export interface Message {
  message: string;
}

export interface ImageRes {
  message: string;
  filePath: string;
}

export interface UpdateDelRes {
  message: string;
  id: number;
}
