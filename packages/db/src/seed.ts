import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function seedData() {
  const hooks = [
    {
      type: "trigger",
      image:
        "https://png.pngtree.com/png-vector/20190420/ourmid/pngtree-thunder-icon-vector-illustration-in-filled-style-for-any-purpose-png-image_968460.jpg",
    },
    {
      type: "webhook",
      image:
        "https://mailparser.io/wp-content/uploads/2018/08/what-is-a-webhook-1024x536.jpeg",
    },
    {
      type: "sendEmail",
      image:
        "https://media.istockphoto.com/id/1125279178/vector/mail-line-icon.jpg?s=612x612&w=0&k=20&c=NASq4hMg0b6UP9V0ru4kxL2-J114O3TaakI467Pzjzw=",
    },
    {
      type: "sendTelegram",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqWrhhk7J2V0Vjaw5PK7r2l3bdzXe2kqYNXA&s",
    },
  ];

  for (const hook of hooks) {
    await prisma.availabeWebhook.create({
      data: hook,
    });
  }
}

seedData()
  .then(() => {
    console.log("Seeding completed.");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
