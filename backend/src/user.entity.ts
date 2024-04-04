import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
// User entity definition
export type UserRoleType = "admin" | "tester";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	// Role flags for substitute immutable identification (no email present)
	@Column({
		type: "enum",
		enum: ["admin", "tester"],
		default: "admin",
	})
	role: UserRoleType;

	// To define if user is the Default User (only 1 can exist)
	@Column({ default: false })
	isDefaultUser: boolean;

	// To deactivate accounts (e.g. tester accounts)
	@Column({ default: true })
	isActive: boolean;

	// Usernames must be unique because we do not ask for emails (no immutable identification)
	@Column({ unique: true })
	userName: string;

	@Column("text")
	password: string;
}
