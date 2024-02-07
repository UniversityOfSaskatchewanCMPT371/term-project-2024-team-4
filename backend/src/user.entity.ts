import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// Define the RoleType enum
enum RoleType {
    BASIC = "basic",
    ADMIN = "admin"
}

// User entity definition
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column("text")
    password: string;

    @Column({
        type: "enum",
        enum: RoleType,
        default: RoleType.BASIC
    })
    role: RoleType;
}
