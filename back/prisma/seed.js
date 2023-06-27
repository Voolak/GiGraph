import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

async function main() {
    
    
    const robert = await prisma.user.findUnique({
        where: {
            email: 'robert@girafe.ia',
        }}).then((user) => {
            if (!user) {
                return prisma.user.create({
                    data: {
                        firstname: 'Robert',
                        lastname: 'Girafe',
                        email: 'robert@girafe.ia',
                        password: '123soleil!',
                    },
                });
            }
        });

    const group1 = await prisma.group.create({
        data: {
            name: 'Group 1',
            directory: '',
            userId: 1,
        },
    });

    const document1 = await prisma.document.create({
        data: {
            name: 'Document 1',
            directory: "C:/Users/Clo/Downloads/documents/BUT_Plaquette_A5_INFO.pdf",
            groupId: 1,
        },
    });
    const document2 = await prisma.document.create({
        data: {
            name: 'Document 2',
            directory: "C:/Users/Clo/Downloads/documents/ContratdapprentissageAgenGradignanMAJ300321.pdf",
            groupId: 1,
        },
    });
    const document3 = await prisma.document.create({
        data: {
            name: 'Document 3',
            directory: "C:/Users/Clo/Downloads/documents/PRO-18-01V03LeContratdeProfessionnalisationAntenneAgenGradignan.pdf",
            groupId: 1,
        },
    });
    const document4 = await prisma.document.create({
        data: {
            name: 'Document 4',
            directory: "C:/Users/Clo/Downloads/documents/PRO-44-01-Aide-Exceptionnelle-2021-AntenneAgen-Gradignan-V01-02-04-21.pdf",
            groupId: 1,
        },
    });

    console.log({ robert, group1, document1, document2, document3, document4 });
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