import { PrismaClient } from '@prisma/client';


export async function getDocuments(req, res) {
  const userId = req.session.userId;
  const prisma = new PrismaClient();
  // if (userId != "undefined" && userId != "" && userId != null) {
    try {
      const documents = await prisma.document.findMany({
        where: {
            userId: userId,
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

export async function getDocumentsByExchange(req, res) {
  const exchangeId = req.params.exchangeId;
  const prisma = new PrismaClient();

  try {
    const exchangeDocuments = await prisma.exchangeDocument.findMany({
      where: {
        exchangeId: 1,
      },
      include: {
        document: true,
      },
    });

    const documents = exchangeDocuments.map((exchangeDocument) => exchangeDocument.document);

    res.status(200).json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing request');
  } finally {
    await prisma.$disconnect();
  }
}

export async function getExchange(req, res) {
  const userId = req.session.userId;
  const prisma = new PrismaClient();
  // if (userId != "undefined" && userId != "" && userId != null) {
  try {
    const exchanges = await prisma.exchange.findMany({
      where: {
        userId: 1,
        // userId: parseInt(userId),
      },
      include: {
        documents: true,
        prompts: true,
        answers: true,
        graphs: true,
      },
    });

    res.status(200).json(exchanges);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing request");
  }
    // } else {
  //   res.status(500).send("Error processing request");
  // }
}
