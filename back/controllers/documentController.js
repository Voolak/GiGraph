import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function uploadDocument(req, res) {
    console.log('victoire', req);
    res.status(200);
    /*try {
        const data = req.body;
        console.log(data)
        console.log(data.name);
        res.status(200);
      } catch (error) {
        console.error(error);
        res.status(500).send("Error processing request");
      }*/
}