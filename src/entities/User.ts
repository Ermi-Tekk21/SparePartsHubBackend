import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("user")
export class User {
  @PrimaryColumn({ type: "varchar", length: 36 })
  id!: string;

  @Column({ type: "varchar", length: 255 })
  fullName!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  username!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  companyName!: string;

  @Column({ type: "text", nullable: true })
  companyDescription!: string;

  @Column({ type: "varchar", length: 1000, nullable: true })
  companyLogo!: string; // Cloudinary URL

  @Column({ type: "varchar", length: 1000, nullable: true })
  digitalSignature!: string; // Cloudinary URL

  @Column({ type: "varchar", length: 1000, nullable: true })
  stamp!: string; // Cloudinary URL

  @Column({ type: "varchar", length: 20, default: "pending" })
  status!: string;

  @Column({ type: "varchar", length: 36, nullable: true })
  registrationToken?: string | null;
}