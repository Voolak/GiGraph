import { PrismaClient } from '@prisma/client';

export async function getDocuments(req, res) {
  const userId = req.session.userId;
  const prisma = new PrismaClient();
  // if (userId != "undefined" && userId != "" && userId != null) {
    try {
      const documents = await prisma.document.findMany({
        where: {
            userId: 1,
            // userId: parseInt(userId),
        },
      });
      
      res.status(200).json(documents);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing request");
    }
  // } else {
  //   res.status(500).send("Error processing request");
  // }
}