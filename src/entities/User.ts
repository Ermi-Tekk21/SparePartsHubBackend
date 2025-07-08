import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  fullName!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, default: "pending" })
  status!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  registrationToken!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  username!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  companyName!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  companyLogo!: string | null;

  @Column({ type: "text", nullable: true })
  companyDescription!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  digitalSignature!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  stamp!: string | null;
}