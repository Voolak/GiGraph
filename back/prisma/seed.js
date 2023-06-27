import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

async function main() {
    
    
    const robert = await prisma.user.findUnique({
        where: {
            email: 'robert@girafe.ia',
        }}).then(async (user) => {
            if (!user) {
                return prisma.user.create({
                    data: {
                        firstname: 'Robert',
                        lastname: 'Girafe',
                        email: 'robert@girafe.ia',
                        password: await bcrypt.hash("123", 10),
                    },
                });
            }
        });

    const group1 = await prisma.group.create({
        data: {
            name: 'Group 1',
            directory: 'documents/RobertGirafe/',
            userId: 1,
        },
    });

    const document1 = await prisma.document.create({
        data: {
            name: 'Document 1',
            directory: "documents/RobertGirafe/docs/BUT_Plaquette_A5_INFO.pdf",
            groupId: 1,
        },
    });
    const document2 = await prisma.document.create({
        data: {
            name: 'Document 2',
            directory: "documents/RobertGirafe/docs/ContratdapprentissageAgenGradignanMAJ300321.pdf",
            groupId: 1,
        },
    });
    const document3 = await prisma.document.create({
        data: {
            name: 'Document 3',
            directory: "documents/RobertGirafe/docs/PRO-18-01V03LeContratdeProfessionnalisationAntenneAgenGradignan.pdf",
            groupId: 1,
        },
    });
    const document4 = await prisma.document.create({
        data: {
            name: 'Document 4',
            directory: "documents/RobertGirafe/docs/PRO-44-01-Aide-Exceptionnelle-2021-AntenneAgen-Gradignan-V01-02-04-21.pdf",
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