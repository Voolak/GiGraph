import dotenv from 'dotenv';
import express, { static as expressStatic } from 'express';
import helmet from 'helmet';
import backendRoutes from './routes/backendRoutes.js';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import expressSession from 'express-session';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import cors from 'cors';

dotenv.config({ path: `.env.local`, override: true });

const app = express();
app.use(helmet());
app.use(cors()); // Add this line for CORS
app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoutes); // Add this line for authentication routes
app.use('/backend', backendRoutes);
app.use('/document', documentRoutes);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
