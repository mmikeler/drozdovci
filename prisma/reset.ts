// Reset database: delete all data without dropping tables

import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import { execSync } from "child_process";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Clearing all data...");

  // Delete in order of dependencies (child tables first)
  await prisma.participant.deleteMany();
  await prisma.burialPlace.deleteMany();
  await prisma.user.deleteMany();

  console.log("All data cleared successfully.");

  // Run seed
  execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
