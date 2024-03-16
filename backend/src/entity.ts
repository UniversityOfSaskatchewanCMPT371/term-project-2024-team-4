import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	PrimaryColumn,
	ManyToOne,
	ManyToMany,
	JoinTable,
	TableInheritance,
	ChildEntity,
	CreateDateColumn,
} from "typeorm";

/**
 * Represents a catalogue of archaeological sites.
 * Each catalogue can contain multiple sites.
 */
@Entity()
export class Catalogue {
	@CreateDateColumn()
	createdDate: Date;

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column("text")
	description: string;

	@OneToMany(() => Site, (site) => site.catalogue)
	sites: Site[];
}

/**
 * Represents the region that a site belongs to.
 */
@Entity()
export class Region {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column("text")
	description: string;

	@OneToMany(() => Site, (site) => site.region)
	sites: Site[];
}

/**
 * Represents the site where archaeological artifacts (projectile points) were found.
 * Each site can contain multiple artifacts.
 */
@Entity()
export class Site {
	@CreateDateColumn()
	createdDate: Date;

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column("text")
	description: string;

	@Column()
	location: string;

	@ManyToOne(() => Catalogue, (catalogue) => catalogue.sites)
	catalogue: Catalogue;

	@ManyToOne(() => Region, (region) => region.sites)
	region: Region;

	@OneToMany(() => Artifact, (artifact) => artifact.site)
	artifacts: Artifact[];
}

/**
 * Represents the time period that archaeological artifacts (projectile points)
 * belong to.
 * Each period can have multiple artifacts belonging to it.
 */
@Entity()
export class Period {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	start: number;

	@Column()
	end: number;

	@OneToMany(() => Culture, (culture) => culture.period)
	cultures: Culture[];
}

/**
 * Represents the culture (design of projectile points to help identify the culture or civilization
 * that created them) that archaeological artifacts (projectile points) belong to.
 * Each culture can have multiple artifacts belonging to it.
 */
@Entity()
export class Culture {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToOne(() => Period, (period) => period.cultures)
	period: Period;

	@OneToMany(
		() => ProjectilePoint,
		(projectilePoint) => projectilePoint.culture,
	)
	projectilePoints: ProjectilePoint[];

	@ManyToMany(() => BladeShape, (bladeShape) => bladeShape.cultures)
	@JoinTable()
	bladeShapes: BladeShape[];

	@ManyToMany(() => BaseShape, (baseShape) => baseShape.cultures)
	@JoinTable()
	baseShapes: BaseShape[];

	@ManyToMany(() => HaftingShape, (haftingShape) => haftingShape.cultures)
	@JoinTable()
	haftingShapes: HaftingShape[];

	@ManyToMany(() => CrossSection, (crossSection) => crossSection.cultures)
	@JoinTable()
	crossSections: CrossSection[];
}

/**
 * Represents the shape of the blade of the artifacts (projectile points)
 */
@Entity()
export class BladeShape {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany(() => Culture, (culture) => culture.bladeShapes)
	cultures: Culture[];

	@OneToMany(
		() => ProjectilePoint,
		(projectilePoint) => projectilePoint.bladeShape,
	)
	projectilePoints: ProjectilePoint[];
}

/**
 * Represents the shape of the base of the artifacts (projectile points)
 */
@Entity()
export class BaseShape {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany(() => Culture, (culture) => culture.baseShapes)
	cultures: Culture[];

	@OneToMany(
		() => ProjectilePoint,
		(projectilePoint) => projectilePoint.baseShape,
	)
	projectilePoints: ProjectilePoint[];
}

/**
 * Represents the hafting shape (the design or form at the base of the projectile point where
 * it is attached or secured to a shaft or handle, commonly known as hafting) of the artifacts (projectile points)
 */
@Entity()
export class HaftingShape {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany(() => Culture, (culture) => culture.haftingShapes)
	cultures: Culture[];

	@OneToMany(
		() => ProjectilePoint,
		(projectilePoint) => projectilePoint.haftingShape,
	)
	projectilePoints: ProjectilePoint[];
}

/**
 * Represents the cross-section of the artifacts (projectile points)
 */
@Entity()
export class CrossSection {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToMany(() => Culture, (culture) => culture.crossSections)
	cultures: Culture[];

	@OneToMany(
		() => ProjectilePoint,
		(projectilePoint) => projectilePoint.crossSection,
	)
	projectilePoints: ProjectilePoint[];
}

// Artifact Type
@Entity()
export class ArtifactType {
	@PrimaryColumn({
		type: "varchar",
		length: 10,
	})
	id: "Lithic" | "Ceramic" | "Faunal";

	@OneToMany(() => Material, (material) => material.artifactType)
	materials: Material[];

	@OneToMany(() => Artifact, (artifact) => artifact.artifactType)
	artifacts: Artifact[];
}

// Artifact (highest superclass, using Single Table Inheritance)
@Entity()
@TableInheritance({ column: { type: "varchar", name: "subtype" } })
export class Artifact {
	@CreateDateColumn()
	createdDate: Date;

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	location: string;

	@Column("text")
	description: string;

	@Column()
	dimensions: string;

	@Column({ nullable: true })
	photo: string;

	@ManyToOne(() => Site, (site) => site.artifacts)
	site: Site;

	@ManyToOne(() => ArtifactType, (artifactType) => artifactType.artifacts)
	artifactType: ArtifactType;

	@ManyToMany(() => Material)
	materials: Material[];
}

// Material Entity
@Entity()
export class Material {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column("text")
	description: string;

	@ManyToOne(() => ArtifactType, (artifactType) => artifactType.materials)
	artifactType: ArtifactType;

	@ManyToMany(() => Artifact)
	@JoinTable()
	artifacts: Artifact[];
}

// Lithic Subtypes (Projectile Point, Basal Knife)
@ChildEntity()
export class ProjectilePoint extends Artifact {
	@ManyToOne(() => Culture, (culture) => culture.projectilePoints)
	culture: Culture;

	@ManyToOne(() => BladeShape, (bladeShape) => bladeShape.projectilePoints)
	bladeShape: BladeShape;

	@ManyToOne(() => BaseShape, (baseShape) => baseShape.projectilePoints)
	baseShape: BaseShape;

	@ManyToOne(
		() => HaftingShape,
		(haftingShape) => haftingShape.projectilePoints,
	)
	haftingShape: HaftingShape;

	@ManyToOne(
		() => CrossSection,
		(crossSection) => crossSection.projectilePoints,
	)
	crossSection: CrossSection;
}
