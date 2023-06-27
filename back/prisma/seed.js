import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

async function main() {
    const robert = await prisma.user.create({
        data: {
            firstname: 'Robert',
            lastname: 'Girafe',
          email: 'robert@girafe.ia',
          password: '123soleil!',
        },
      });
    console.log({ robert })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })