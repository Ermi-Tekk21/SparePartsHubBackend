import { AppDataSource } from "./config/data-source";

export async function setupTestDatabase() {
  await AppDataSource.initialize();
  await AppDataSource.query(`
    CREATE TABLE IF NOT EXISTS \`user\` (
      \`id\` varchar(36) NOT NULL,
      \`fullName\` varchar(255) NOT NULL,
      \`email\` varchar(255) NOT NULL,
      \`username\` varchar(255) NULL,
      \`companyName\` varchar(255) NULL,
      \`companyDescription\` text NULL,
      \`companyLogo\` varchar(1000) NULL,
      \`digitalSignature\` varchar(1000) NULL,
      \`stamp\` varchar(1000) NULL,
      \`status\` varchar(20) NOT NULL DEFAULT 'pending',
      \`registrationToken\` varchar(36) NULL,
      UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`),
      PRIMARY KEY (\`id\`)
    ) ENGINE=InnoDB;
  `);
}