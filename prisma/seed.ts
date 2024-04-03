import { prisma } from "../src/lib/prisma";

async function seed() {
  await prisma.event.create({
    data: {
      id: "dec85abf-49a0-4ba0-9fd1-29fa2c45e9ed",
      title: "Evento de teste 1",
      slug: "evento-de-teste-1",
      details: "Um evento de teste para você testar sua API",
      maximumAttendees: 120,
    },
  });
}

seed().then(() => {
  console.log("Database seeded.");
  prisma.$disconnect();
});
