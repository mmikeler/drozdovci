import "dotenv/config";
import { hash } from "bcryptjs";
import { readFileSync } from "fs";
import { prisma } from "@/lib/prisma";

type User = {
  login: string;
  role: string;
};

async function main() {
  console.log("Seeding users...");

  // Read JSON files
  const users = readFileSync("prisma/seeds/users.json", "utf-8");
  //const participants = readFileSync("prisma/seeds/participants.json", "utf-8");

  // ================ USERS
  // Delete all users
  await prisma.user.deleteMany({});
  console.log(`Users deleted`);

  // Create users data
  const usersData = await Promise.all(
    JSON.parse(users).map(async (user: User) => {
      return {
        login: user.login,
        password: await hash(user.role.toLowerCase() + "123", 10),
        role: user.role,
      };
    }),
  );

  // Create users
  await prisma.user.createMany({
    data: usersData,
  });

  console.log(`Users created`);

  // ======================= PARTICIPANTS - DEPRECATED
  // Delete all participants
  // await prisma.participant.deleteMany({});

  // console.log(`Participants deleted`);

  // await prisma.participant.createMany({
  //   data: JSON.parse(participants),
  // });

  // console.log(`Participants created`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
