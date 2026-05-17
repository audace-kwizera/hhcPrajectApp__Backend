const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash(
    "123456",
    10
  );

  await prisma.employe.create({
    data: {
      nom: "Helen Admin",
      email: "admin@hhc.com",
      password: hashedPassword,
      role: "GERANTE",
    },
  });

  console.log("✅ Seed done");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });