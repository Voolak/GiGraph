import { PrismaClient } from '@prisma/client';


export async function getDocuments(req, res) {
  const userId = req.userId ?? 1;
  const prisma = new PrismaClient();
  // if (userId != "undefined" && userId != "" && userId != null) {
    try {
      const exchangeDocuments = await prisma.exchangeDocument.findMany({
        where: {
          exchangeId: 1,
        }
      });
      const documents = await prisma.document.findMany({
        where: {
          id: {
            in: exchangeDocuments.map((exchangeDocument) => exchangeDocument.documentId),
          },
        },
      });

      const data = exchangeDocuments.map((exchangeDocument) => {
        const document = documents.find((document) => document.id === exchangeDocument.documentId);
        return [document, exchangeDocument.processed];
      });
      console.log(data);
      
      res.status(200).json(data);
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


//traiter les documents
// - récupérer les noms de docs dans le front et recuperer les donnees de chaque doc dans la bd (avec le userId)
// - appeler l'embedding avec ces docs là
// - enregistrer les embeddings dans documents/RobertGirafe/vectors/iut et enregistrer le chemin dans la bd (dans exchange)
