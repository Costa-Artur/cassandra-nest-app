import { PrimaryGeneratedColumn } from "typeorm";

export class User {
    @PrimaryGeneratedColumn()
    userId: number;
    username: string;
    email: string;
    password: string;
}
