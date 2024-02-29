import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
// User entity definition
@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userName: string;

	@Column("text")
	password: string;

	
}
